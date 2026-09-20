import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

// The settings table and the failure handling live in a module with no vscode
// dependency, so these tests run the real code instead of matching source text.
const { OWNED_SETTINGS, writeOwnedSettings, describeExperienceFailure } =
  await import(new URL('dist/experience-settings.js', root).href);

test('every CRUXIDE-owned setting is written, and only those', async () => {
  const written = [];
  const result = await writeOwnedSettings(async (setting) => {
    written.push(`${setting.section}.${setting.key}`);
  });

  assert.equal(result.applied, true);
  assert.deepEqual(result.failed, []);
  assert.deepEqual(written.sort(), [
    'editor.fontFamily',
    'editor.fontLigatures',
    'terminal.integrated.fontFamily',
    'window.title',
    'workbench.colorTheme',
    'workbench.iconTheme',
  ]);
});

test('one failing setting does not stop the others and is reported', async () => {
  const written = [];
  const result = await writeOwnedSettings(async (setting) => {
    if (setting.key === 'iconTheme') {
      throw new Error('icon theme extension is not installed');
    }
    written.push(`${setting.section}.${setting.key}`);
  });

  // The failure must be reported rather than thrown.
  assert.equal(result.applied, false, 'applied must be false when a setting fails');
  assert.equal(result.failed.length, 1);
  assert.equal(result.failed[0].setting, 'workbench.iconTheme');
  assert.match(result.failed[0].detail, /icon theme extension is not installed/);

  // Every other setting must still have been attempted.
  assert.equal(written.length, OWNED_SETTINGS.length - 1);
  assert.ok(written.includes('editor.fontFamily'));
  assert.ok(written.includes('terminal.integrated.fontFamily'));
  assert.ok(!written.includes('workbench.iconTheme'));
});

test('several failures are all collected', async () => {
  const result = await writeOwnedSettings(async (setting) => {
    if (setting.section === 'editor') throw new Error('editor is read-only');
  });

  assert.equal(result.applied, false);
  assert.deepEqual(
    result.failed.map((f) => f.setting).sort(),
    ['editor.fontFamily', 'editor.fontLigatures'],
  );
  assert.match(describeExperienceFailure(result), /editor\.fontFamily \(editor is read-only\)/);
});

test('a non-Error rejection is still reported', async () => {
  const result = await writeOwnedSettings(async (setting) => {
    if (setting.key === 'title') throw 'window is locked';
  });

  assert.equal(result.applied, false);
  assert.equal(result.failed[0].setting, 'window.title');
  assert.equal(result.failed[0].detail, 'window is locked');
});

test('applying twice converges on the same values', async () => {
  const first = [];
  const second = [];
  await writeOwnedSettings(async (s) => { first.push(`${s.section}.${s.key}=${String(s.value)}`); });
  await writeOwnedSettings(async (s) => { second.push(`${s.section}.${s.key}=${String(s.value)}`); });
  assert.deepEqual(first, second, 'the experience must be idempotent');
});

test('the owned settings carry the Figma code typography', () => {
  const byKey = new Map(OWNED_SETTINGS.map((s) => [`${s.section}.${s.key}`, s.value]));
  assert.match(String(byKey.get('editor.fontFamily')), /'Roboto Mono'/);
  assert.equal(byKey.get('terminal.integrated.fontFamily'), "'Roboto Mono'");
  assert.equal(byKey.get('workbench.colorTheme'), 'CRUXIDE Dark');
  assert.equal(byKey.get('editor.fontLigatures'), true);
});

test('the VS Code writer targets Global scope and nothing else', async () => {
  const source = await readText('src/experience.ts');
  // The one place vscode is touched; it must write at Global scope, which is
  // what "the active profile" means for a VS Code extension.
  assert.match(source, /vscode\.ConfigurationTarget\.Global/);
  const updates = source.match(/\.update\(/g) ?? [];
  assert.equal(updates.length, 1, 'settings must be written through one code path');
});

test('confirmed setup applies the experience automatically and reports it honestly', async () => {
  const panel = await readText('src/setup-panel.ts');

  const confirmIndex = panel.indexOf("if (confirmation !== 'Apply setup') return;");
  const applyIndex = panel.indexOf('await applyExperience()');
  assert.ok(confirmIndex > 0, 'setup must still require the native confirmation');
  assert.ok(applyIndex > confirmIndex, 'the experience must only be applied after the user confirms');

  assert.match(panel, /result\.failedExtensions\.length > 0 \|\| !experience\.applied/);
  assert.match(panel, /showWarningMessage\(summary\)/);
  assert.match(panel, /command: 'applied', result, experience/);
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

  assert.match(extension, /if \(result\.applied\) \{/);
  assert.match(extension, /showWarningMessage\(/);
});

test('the webview surfaces the experience outcome to the user', async () => {
  const script = await readText('media/setup.js');
  assert.match(script, /const experience = message\.experience;/);
  assert.match(script, /could not be written; run CRUXIDE: Apply CRUXIDE Experience to retry/);
});
