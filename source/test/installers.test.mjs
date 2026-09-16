import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('Windows separates CLI installation from GUI shortcut launch', async () => {
  const source = await readFile(new URL('installers/install-windows.ps1', root), 'utf8');
  assert.match(source, /function Resolve-CodeCli/);
  assert.match(source, /function Confirm-CodeSignature/);
  assert.match(source, /Get-AuthenticodeSignature/);
  assert.match(source, /function Invoke-CodeCli/);
  assert.match(source, /function Ensure-CodeProfile/);
  assert.match(source, /System\.Diagnostics\.ProcessStartInfo/);
  assert.match(source, /RedirectStandardError = \$true/);
  assert.match(source, /\[int\]\$process\.ExitCode/);
  assert.match(source, /code\.cmd/);
  assert.match(source, /Invoke-CodeCli -CodeCli \$codeCli/);
  assert.match(source, /New-CruxShortcut[^]*-CodeExecutable \$codeExecutable/);
  assert.match(source, /--list-extensions/);
  assert.match(source, /Confirm-ReleaseChecksum/);
  assert.match(source, /Cannot verify a release file outside the extracted package/);
  assert.match(source, /function Install-RobotoMono/);
  assert.match(source, /RobotoMono-Variable\.ttf/);
  assert.doesNotMatch(source, /\$ExtensionPackIds/);
  assert.match(source, /selected VS Code CLI is not paired with Code\.exe/);
  assert.match(source, /--locate-extension/);
  assert.match(source, /track-specific developer tools/);
  assert.match(source, /Get-FileHash[\s\S]*Font already installed/);
  assert.match(source, /contentAddressedName/);
  assert.doesNotMatch(source, /\$LASTEXITCODE\s*=/);
  assert.doesNotMatch(source, /& \$codeExecutable[^\n]*--install-extension/);
});

test('macOS verifies checksum and installed extension ID', async () => {
  const source = await readFile(new URL('installers/install-macos.sh', root), 'utf8');
  assert.match(source, /shasum -a 256/);
  assert.match(source, /manifest_name=/);
  assert.match(source, /--list-extensions/);
  assert.match(source, /cruxcode\.cruxide/);
  assert.doesNotMatch(source, /extension_pack_ids=/);
  assert.match(source, /ensure_profile\(\)/);
  assert.match(source, /--new-window --skip-add-to-recently-opened/);
  assert.match(source, /RobotoMono-Variable\.ttf/);
  assert.match(source, /set -euo pipefail/);
  assert.match(source, /required_id_normalized/);
  assert.match(source, /--locate-extension/);
  assert.match(source, /track-specific developer tools/);
  assert.doesNotMatch(source, /--install-extension "\$required_id" --force/);
});

test('installers install only CRUXIDE and defer track tools to consent-based setup', async () => {
  const [manifestText, windowsSource, macSource] = await Promise.all([
    readFile(new URL('package.json', root), 'utf8'),
    readFile(new URL('installers/install-windows.ps1', root), 'utf8'),
    readFile(new URL('installers/install-macos.sh', root), 'utf8'),
  ]);
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.extensionPack, undefined);
  assert.doesNotMatch(windowsSource, /Installing required developer tool/);
  assert.doesNotMatch(macSource, /Installing required developer tool/);
  assert.match(windowsSource, /track-specific developer tools/);
  assert.match(macSource, /track-specific developer tools/);
});
