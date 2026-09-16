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
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|eval\(/);
  assert.doesNotMatch(script, /https?:\/\//i);
});

test('profile experience applies the Figma code typography', async () => {
  const extension = await readText('src/extension.ts');
  assert.match(extension, /'Roboto Mono'/);
  assert.match(extension, /'fontFamily'/);
  assert.match(extension, /terminal\.integrated/);
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
