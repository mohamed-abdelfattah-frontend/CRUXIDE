import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const extensionRoot = new URL('../', import.meta.url);
const repositoryRoot = new URL('../../', import.meta.url);

const readExtensionFile = (path) => readFile(new URL(path, extensionRoot), 'utf8');
const readWorkflow = (name) =>
  readFile(new URL(`.github/workflows/${name}`, repositoryRoot), 'utf8');

/**
 * The publish job re-verifies the checksum that the release job recorded, which
 * is the control that stops a tampered or mismatched VSIX reaching the
 * Marketplace. The two steps have to agree on the filename format.
 *
 * They did not before 1.2.0. release.yml runs `sha256sum ./*.vsix`, which
 * records "./cruxide-X.Y.Z.vsix", while publish-marketplace.yml greped for a
 * bare "  cruxide-X.Y.Z.vsix$". The pattern could never match, so every
 * Marketplace publish failed at checksum verification.
 */
test('the publish job can match the checksum entry the release job writes', async () => {
  const [manifest, releaseWorkflow, publishWorkflow] = await Promise.all([
    readExtensionFile('package.json').then(JSON.parse),
    readWorkflow('release.yml'),
    readWorkflow('publish-marketplace.yml'),
  ]);

  const generation = releaseWorkflow.match(/sha256sum ((?:\.\/)?)\*\.vsix/);
  assert.ok(generation, 'release.yml must record a checksum for the VSIX');

  // sha256sum echoes the path exactly as the glob expanded it.
  const recordedName = `${generation[1]}cruxide-${manifest.version}.vsix`;

  const selection = publishWorkflow.match(/grep -E "([^"]+)" SHA256SUMS\.txt/);
  assert.ok(selection, 'publish-marketplace.yml must select the VSIX checksum entry');

  const selector = new RegExp(selection[1].replaceAll('${VERSION}', manifest.version));

  // GNU sha256sum separates hash and name with two spaces in text mode and a
  // space plus an asterisk in binary mode. Both must be accepted.
  assert.ok(
    selector.test(`0123456789abcdef  ${recordedName}`),
    `publish-marketplace.yml cannot match "${recordedName}", the entry release.yml writes`,
  );
  assert.ok(
    selector.test(`0123456789abcdef *${recordedName}`),
    'binary-mode checksum entries must also match',
  );

  // It must stay specific: a different artifact must not satisfy the check.
  assert.ok(
    !selector.test(`0123456789abcdef  ${generation[1]}cruxide-9.9.9.vsix`),
    'the selector must not match a VSIX of another version',
  );
  assert.ok(
    !selector.test(`0123456789abcdef  ${generation[1]}CRUXIDE-v${manifest.version}.zip`),
    'the selector must not match the release ZIP',
  );
});

test('publishing is gated on an approved environment and an exact release asset', async () => {
  const publishWorkflow = await readWorkflow('publish-marketplace.yml');

  assert.match(publishWorkflow, /environment: vscode-marketplace/);
  assert.match(publishWorkflow, /secrets\.VSCE_PAT/);
  assert.match(publishWorkflow, /gh release download/);
  assert.match(publishWorkflow, /sha256sum --check --strict/);

  // A missing or ambiguous entry must fail loudly rather than silently
  // verifying nothing, which is what an unguarded grep pipeline would do.
  assert.match(publishWorkflow, /-ne 1 \]; then/);
  assert.match(publishWorkflow, /exit 1/);

  // The published artifact must be the downloaded release asset, never a
  // locally rebuilt one.
  assert.doesNotMatch(publishWorkflow, /package:release|package:vsix/);
});

test('the release job is tag-gated and publishes from the verified commit', async () => {
  const releaseWorkflow = await readWorkflow('release.yml');

  assert.match(releaseWorkflow, /tags: \['v\*'\]/);
  assert.match(releaseWorkflow, /npm run verify:release -- "\$GITHUB_REF_NAME"/);
  assert.match(releaseWorkflow, /--verify-tag/);
  assert.match(releaseWorkflow, /persist-credentials: false/);
});
