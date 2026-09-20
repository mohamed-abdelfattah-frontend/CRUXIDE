import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

test('the experience writes only CRUXIDE-owned settings', async () => {
  const source = await readText('src/experience.ts');

  const owned = [...source.matchAll(/\{ section: '([^']+)', key: '([^']+)'/g)]
    .map(([, section, key]) => `${section}.${key}`);

  assert.deepEqual(owned.sort(), [
    'editor.fontFamily',
    'editor.fontLigatures',
    'terminal.integrated.fontFamily',
    'window.title',
    'workbench.colorTheme',
    'workbench.iconTheme',
  ]);

  // Every write must target the settings CRUXIDE declares, at Global scope, so
  // unrelated user or workspace configuration is never touched.
  const updateCalls = source.match(/\.update\(/g) ?? [];
  assert.equal(updateCalls.length, 1, 'settings must be written through one shared code path');
  assert.match(source, /vscode\.ConfigurationTarget\.Global/);
});

test('the experience reports partial failure instead of throwing', async () => {
  const source = await readText('src/experience.ts');

  assert.match(source, /catch \(error: unknown\) \{/, 'a failed setting must be caught');
  assert.match(source, /failed\.push\(/, 'a failed setting must be recorded');
  assert.match(
    source,
    /applied: failed\.length === 0/,
    'applied must be true only when every owned setting was written',
  );
});

test('confirmed setup applies the experience automatically and reports it honestly', async () => {
  const panel = await readText('src/setup-panel.ts');

  const confirmIndex = panel.indexOf("if (confirmation !== 'Apply setup') return;");
  const applyIndex = panel.indexOf('await applyExperience()');
  assert.ok(confirmIndex > 0, 'setup must still require the native confirmation');
  assert.ok(
    applyIndex > confirmIndex,
    'the experience must only be applied after the user confirms',
  );

  // A partial failure must not be presented as a complete success.
  assert.match(panel, /const experience = await applyExperience\(\);/);
  assert.match(panel, /result\.failedExtensions\.length > 0 \|\| !experience\.applied/);
  assert.match(panel, /showWarningMessage\(summary\)/);
  assert.match(panel, /showInformationMessage\(summary\)/);
  assert.match(
    panel,
    /command: 'applied', result, experience/,
    'the webview must receive the experience outcome',
  );
});

test('the manual Apply Experience command stays available and honest', async () => {
  const [manifest, extension] = await Promise.all([
    readText('package.json').then(JSON.parse),
    readText('src/extension.ts'),
  ]);

  const command = manifest.contributes.commands
    .find((item) => item.command === 'cruxide.applyExperience');
  assert.ok(command, 'the manual command must remain contributed');
  assert.equal(command.title, 'Apply CRUXIDE Experience');
  assert.ok(manifest.contributes.menus.commandPalette
    .some((item) => item.command === 'cruxide.applyExperience'));

  assert.match(extension, /if \(result\.applied\) \{/);
  assert.match(
    extension,
    /showWarningMessage\(/,
    'a partly applied experience must warn rather than claim success',
  );
});

test('the webview surfaces the experience outcome to the user', async () => {
  const script = await readText('media/setup.js');

  assert.match(script, /const experience = message\.experience;/);
  assert.match(script, /experience\.applied/);
  assert.match(
    script,
    /could not be written; run CRUXIDE: Apply CRUXIDE Experience to retry/,
    'a failed experience must tell the user how to retry',
  );
});
