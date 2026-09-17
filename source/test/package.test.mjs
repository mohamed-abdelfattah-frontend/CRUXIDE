import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

test('manifest keeps the release security invariants', async () => {
  const [manifest, lockfile] = await Promise.all([
    readText('package.json').then(JSON.parse),
    readText('package-lock.json').then(JSON.parse),
  ]);

  assert.equal(manifest.name, 'cruxide');
  assert.equal(manifest.publisher, 'cruxcode');
  assert.equal(manifest.private, true);
  assert.equal(manifest.repository.url, 'https://github.com/mohamed-abdelfattah-frontend/CRUXIDE.git');
  assert.equal(manifest.homepage, 'https://www.cruxcode.dev');
  assert.equal(manifest.bugs.url, 'https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/issues');
  assert.match(manifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.equal(lockfile.version, manifest.version);
  assert.equal(lockfile.packages[''].version, manifest.version);
  assert.equal(manifest.capabilities.untrustedWorkspaces.supported, true);
  assert.equal(manifest.capabilities.virtualWorkspaces.supported, true);
  assert.deepEqual(manifest.extensionKind, ['ui']);
  assert.equal(manifest.dependencies, undefined);
  assert.equal(manifest.extensionPack, undefined);
  assert.ok(manifest.files.includes('skills/**'));
  assert.ok(manifest.activationEvents.includes('onCommand:cruxide.openSkills'));
  assert.ok(manifest.activationEvents.includes('onCommand:cruxide.openSetup'));
  assert.ok(manifest.contributes.commands.some(({ command }) => command === 'cruxide.openSkills'));
  assert.ok(manifest.contributes.commands.some(({ command }) => command === 'cruxide.openSetup'));
  const tracksSource = await readText('src/tracks-catalog.ts');
  const trackExtensionIds = [...tracksSource.matchAll(/extension\('([^']+)'/g)].map((match) => match[1]);
  assert.ok(trackExtensionIds.length >= 75);
  assert.equal(new Set(trackExtensionIds.map((id) => id.toLowerCase())).size, trackExtensionIds.length);
  for (const requiredId of [
    'angular.ng-template',
    'bradlc.vscode-tailwindcss',
    'dsznajder.es7-react-js-snippets',
    'pulkitgangwar.nextjs-snippets',
    'suhelmakkad.shadcn-ui',
    'imgildev.vscode-nestjs-snippets-extension',
    'imgildev.vscode-nestjs-generator',
    'Compulim.vscode-express',
    'github.copilot-chat',
    'streetsidesoftware.code-spell-checker',
    'aykutsarac.jsoncrack-vscode',
    'alefragnani.separators',
    'gruntfuggly.todo-tree',
    'UltraByteSoftwares.markdown-tree',
    'shd101wyy.markdown-preview-enhanced',
  ]) {
    assert.ok(trackExtensionIds.includes(requiredId), `${requiredId} must be curated`);
  }
  for (const requiredId of [
    'JetBrains.kotlin-server',
    'swiftlang.swift-vscode',
    'Dart-Code.flutter',
    'msjsdiag.vscode-react-native',
    'ms-python.python',
    'ms-toolsai.jupyter',
    'charliermarsh.ruff',
    'laravel.vscode-laravel',
    'ms-dotnettools.csdevkit',
    'vscjava.vscode-java-pack',
    'vmware.vscode-boot-dev-pack',
  ]) assert.ok(trackExtensionIds.includes(requiredId), `${requiredId} must be curated`);
  assert.equal(manifest.qna, false);
});

test('release publication is version-gated, secret-gated, and publishes an existing VSIX', async () => {
  const [manifest, verifier, publisher, releaseWorkflow, publishWorkflow, policy] = await Promise.all([
    readText('package.json').then(JSON.parse),
    readText('scripts/verify-release.mjs'),
    readText('scripts/publish-marketplace.mjs'),
    readText('.github/workflows/release.yml'),
    readText('.github/workflows/publish-marketplace.yml'),
    readText('SECURITY.md'),
  ]);

  assert.match(verifier, /`v\$\{manifest\.version\}`/);
  assert.match(verifier, /GITHUB_REF_TYPE === 'tag'/);
  assert.match(verifier, /lockfile\.packages\[''\]\.version/);
  assert.match(publisher, /process\.env\.VSCE_PAT/);
  assert.match(publisher, /publishVSIX/);
  assert.match(publisher, /release directory/);
  assert.doesNotMatch(publisher, /spawnSync|execSync|shell:\s*true/);
  assert.match(releaseWorkflow, /npm run verify:release/);
  assert.match(releaseWorkflow, /sha256sum \.\/\*\.vsix \.\/\*\.zip/);
  assert.match(publishWorkflow, /environment: vscode-marketplace/);
  assert.match(publishWorkflow, /secrets\.VSCE_PAT/);
  assert.match(publishWorkflow, /gh release download/);
  assert.match(publishWorkflow, /sha256sum --check --strict/);
  assert.match(policy, /security\/advisories\/new/);
  assert.equal(manifest.scripts['publish:marketplace'], 'node scripts/publish-marketplace.mjs');
});

test('webview has no inline executable content or remote asset loads', async () => {
  const [panel, script, style] = await Promise.all([
    readText('src/home-panel.ts'),
    readText('media/home.js'),
    readText('media/home.css'),
  ]);

  assert.doesNotMatch(panel, /<style(?:\s|>)/i);
  assert.doesNotMatch(panel, /<script(?!\s+src=)/i);
  assert.doesNotMatch(`${script}\n${style}`, /https?:\/\//i);
  assert.doesNotMatch(panel, /<(?:img|script|link)[^>]+(?:src|href)=["']https?:/i);
  assert.match(panel, /default-src 'none'/);
  assert.match(panel, /font-src \$\{webview\.cspSource\}/);
  assert.match(panel, /localResourceRoots/);
  assert.match(panel, /https:\/\/www\.cruxcode\.dev/);
  assert.match(panel, /https:\/\/www\.linkedin\.com\/in\/mohamed-khaled-abdelfattah/);
  assert.match(panel, /vscode\.env\.openExternal/);
  assert.match(panel, /Mohamed Khaled Abdelfattah/);
  assert.match(panel, /Developed by CRUX Team/);
  assert.match(panel, /Open Skills Manager/);
  assert.ok(panel.indexOf('class="brand-visual"') > panel.indexOf('class="about"'));
});

test('setup webview is local, consent-based, and does not auto-install on ready', async () => {
  const [panel, script] = await Promise.all([
    readText('src/setup-panel.ts'),
    readText('media/setup.js'),
  ]);
  assert.match(panel, /default-src 'none'/);
  assert.match(panel, /Apply setup/);
  assert.match(panel, /No language runtime, SDK, project package, or dependency is installed/);
  assert.match(script, /Everything is selected by default|state\.catalog\.tracks\.map/);
  assert.match(script, /updateSummary\(\)/);
  assert.match(script, /data-track-id/);
  assert.doesNotMatch(script, /input\.addEventListener\('change',[^\n]+render\(\)/);
  assert.match(panel, /Open CRUX Skills Manager — advanced/);
  assert.match(panel, /automatically includes its mapped skills and rules/);
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|eval\(/);
  assert.doesNotMatch(script, /https?:\/\//i);
});

test('profile experience applies the Figma code typography', async () => {
  const extension = await readText('src/extension.ts');
  assert.match(extension, /'Roboto Mono'/);
  assert.match(extension, /'fontFamily'/);
  assert.match(extension, /terminal\.integrated/);
  assert.match(extension, /cruxide\.setupPrompted\.v2/);
  assert.match(extension, /setupOpened = await openFirstRunSetup/);
  assert.match(extension, /SetupPanel\.show\(context, output\)/);
  assert.match(extension, /No tools are installed until the user confirms/);
  assert.doesNotMatch(extension, /'Not now'/);
});

test('production compilation omits source maps', async () => {
  const config = JSON.parse(await readText('tsconfig.json'));
  assert.equal(config.compilerOptions.sourceMap, false);
});

test('VSIX packaging awaits the supported API and rejects truncated archives', async () => {
  const source = await readText('scripts/package.mjs');
  assert.match(source, /await createVSIX/);
  assert.match(source, /await waitForCompletedWrite/);
  assert.match(source, /centralDirectoryOffset \+ centralDirectorySize/);
  assert.match(source, /unexpectedly small/);
  assert.match(source, /Packaged VSIX is incomplete/);
  assert.doesNotMatch(source, /spawnSync|npx\.cmd|shell:\s*true/);
});
