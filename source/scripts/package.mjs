import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const output = `release/${manifest.name}-${manifest.version}.vsix`;
const vsce = fileURLToPath(new URL('../node_modules/@vscode/vsce/vsce', import.meta.url));
const result = spawnSync(
  process.execPath,
  [
    vsce,
    'package',
    '--no-dependencies',
    '--allow-missing-repository',
    '--out',
    output,
  ],
  { stdio: 'inherit' },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
