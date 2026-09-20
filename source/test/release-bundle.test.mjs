import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

/**
 * The release bundle copies the working tree so the published archive carries
 * the complete source. Anything the build produces locally must be excluded.
 *
 * The exclusion list used to be hand-maintained and omitted .vscode-test, the
 * VS Code build that @vscode/test-electron downloads for the smoke test. A
 * local `npm run smoke:test` followed by `npm run package:release` therefore
 * produced a 368 MB archive containing a full editor instead of a 27 MB one.
 */
test('release exclusions are derived from .gitignore, not a second hand-written list', async () => {
  const script = await readText('scripts/release.mjs');

  assert.match(
    script,
    /const gitignore = await readFile\(join\(projectRoot, '\.gitignore'\), 'utf8'\)/,
    'the exclusion list must be derived from .gitignore so the two cannot drift',
  );
  assert.match(script, /ignoredSourceEntries = new Set\(\[/);
});

test('every ignored build directory is excluded from the release bundle', async () => {
  const [script, gitignore] = await Promise.all([
    readText('scripts/release.mjs'),
    readText('.gitignore'),
  ]);

  // Reproduce the script's own derivation and assert the result covers every
  // directory the repository ignores.
  const derived = new Set([
    '.git',
    'release',
    ...gitignore
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#') && !line.includes('*'))
      .map((line) => (line.endsWith('/') ? line.slice(0, -1) : line)),
  ]);

  for (const required of ['.git', 'release', 'node_modules', 'dist', '.vscode-test']) {
    assert.ok(
      derived.has(required),
      `${required} must be excluded from the release source bundle`,
    );
  }

  // The script must consult the derived set when copying.
  assert.match(script, /if \(!ignoredSourceEntries\.has\(entry\.name\)\)/);
});

test('the smoke-test download directory is ignored by git', async () => {
  const gitignore = await readText('.gitignore');
  assert.match(
    gitignore,
    /^\.vscode-test\/$/m,
    '.vscode-test/ must be ignored so a 300 MB editor is never committed or bundled',
  );
});
