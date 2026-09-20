import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const extensionRoot = new URL('../', import.meta.url);
const repositoryRoot = new URL('../../', import.meta.url);

/**
 * The repository root carries a partial copy of some extension files. CI builds,
 * packages, and publishes `source/`, so work that lands only in the root copy
 * never ships. That is exactly what happened before 1.2.0: the database tracks,
 * the CRUXCODE.DEV branding, and the version bump were committed to the root and
 * a 1.2.0 build would have contained 1.1.0 content.
 *
 * These tests fail if the two copies drift again. If the root duplicates are
 * removed in a later cleanup, the tests pass unchanged: a missing root file is
 * not a divergence.
 */
const MIRRORED_FILES = [
  'src/home-panel.ts',
  'src/tracks-catalog.ts',
  'scripts/skill-definitions.mjs',
  'scripts/smoke-test.mjs',
  'snippets/typescript.json',
  'snippets/typescriptreact.json',
  'test/package.test.mjs',
  'test/skills.test.mjs',
  'test/tracks.test.mjs',
  'installers/INSTALL.md',
  'installers/install-windows.ps1',
  'installers/install-macos.sh',
  'CHANGELOG.md',
];

async function readIfPresent(base, path) {
  try {
    // Normalise line endings: the trees are checked out with core.autocrlf on
    // Windows, so EOL is not a meaningful difference here.
    return (await readFile(new URL(path, base), 'utf8')).replaceAll('\r\n', '\n');
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

for (const path of MIRRORED_FILES) {
  test(`root and source copies of ${path} agree`, async () => {
    const [rootCopy, sourceCopy] = await Promise.all([
      readIfPresent(repositoryRoot, path),
      readIfPresent(extensionRoot, path),
    ]);

    if (rootCopy === undefined) return; // Root duplicate removed: nothing to compare.
    assert.ok(sourceCopy !== undefined, `source/${path} is missing while the root copy exists`);
    assert.equal(
      rootCopy,
      sourceCopy,
      `${path} differs between the repository root and source/. `
      + 'source/ is the tree CI builds and publishes, so apply the change there.',
    );
  });
}

test('the published version is identical in both manifests and both lockfiles', async () => {
  const read = async (base, path) => JSON.parse(await readIfPresent(base, path));
  const sourceManifest = await read(extensionRoot, 'package.json');
  const sourceLock = await read(extensionRoot, 'package-lock.json');

  assert.match(sourceManifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.equal(sourceLock.version, sourceManifest.version);
  assert.equal(sourceLock.packages[''].version, sourceManifest.version);

  const rootManifestText = await readIfPresent(repositoryRoot, 'package.json');
  if (rootManifestText === undefined) return;

  const rootManifest = JSON.parse(rootManifestText);
  const rootLock = JSON.parse(await readIfPresent(repositoryRoot, 'package-lock.json'));

  assert.equal(
    rootManifest.version,
    sourceManifest.version,
    'the root manifest version must match source/package.json',
  );
  assert.equal(rootLock.version, sourceManifest.version);
  assert.equal(rootLock.packages[''].version, sourceManifest.version);

  // Identity fields must never drift: they decide what the Marketplace publishes.
  for (const field of ['name', 'publisher', 'displayName', 'description', 'license', 'icon', 'main']) {
    assert.equal(
      rootManifest[field],
      sourceManifest[field],
      `package.json "${field}" differs between the repository root and source/`,
    );
  }
});

test('no shipped documentation advertises a stale release version', async () => {
  const manifest = JSON.parse(await readIfPresent(extensionRoot, 'package.json'));
  const version = manifest.version;

  for (const path of ['README.md', 'installers/INSTALL.md']) {
    const text = await readIfPresent(extensionRoot, path);
    assert.ok(text !== undefined, `${path} must exist`);

    // Installer and download instructions must name the version being released.
    const referenced = [...text.matchAll(/CRUXIDE-v(\d+\.\d+\.\d+)|cruxide-(\d+\.\d+\.\d+)\.vsix/g)]
      .map((match) => match[1] ?? match[2]);

    for (const found of referenced) {
      assert.equal(found, version, `${path} references version ${found} but the release is ${version}`);
    }
  }
});
