import assert from 'node:assert/strict';
import { copyFile, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

// The release script imports this module, so the tests exercise the same
// implementation rather than a copy of the algorithm.
const { deriveIgnoredEntries, shouldCopyEntry, isIgnored, copyFiltered } =
  await import(new URL('scripts/release-exclusions.mjs', root).href);

/**
 * The release bundle copies the working tree so the published archive carries
 * complete source. Anything the build produces locally must be excluded.
 *
 * The exclusion list used to be hand-maintained and omitted .vscode-test, the
 * VS Code build that @vscode/test-electron downloads for the smoke test. A
 * local `npm run smoke:test` followed by `npm run package:release` therefore
 * produced a 368 MB archive containing a full editor, against 27 MB.
 */

test('the real .gitignore excludes every build directory', async () => {
  const ignored = deriveIgnoredEntries(await readText('.gitignore'));

  for (const required of ['.git', 'release', 'node_modules', 'dist', '.vscode-test']) {
    assert.ok(isIgnored(ignored, required), `${required} must be excluded from the release bundle`);
  }

  // Glob rules must be honoured, not discarded: a stray root-level artefact
  // such as build.vsix is covered by *.vsix and must never reach the archive.
  assert.ok(isIgnored(ignored, 'build.vsix'), '*.vsix must exclude a root .vsix');
  assert.ok(isIgnored(ignored, 'cruxide-1.2.0.vsix'));
  assert.ok(isIgnored(ignored, 'CRUXIDE-v1.2.0.zip'), '*.zip must exclude a root .zip');
  assert.ok(!isIgnored(ignored, 'vsix-notes.md'), 'a glob must not over-match');

  // Source that must survive.
  for (const kept of ['src', 'scripts', 'test', 'media', 'themes', 'skills', 'package.json']) {
    assert.ok(shouldCopyEntry(ignored, kept), `${kept} must be copied into the bundle`);
  }
});

test('derivation handles comments, blanks, negations, globs, and nested paths', () => {
  const ignored = deriveIgnoredEntries([
    '# a comment',
    '',
    'node_modules/',
    '.vscode-test/',
    'dist/',
    '*.vsix',          // a glob names no single top-level entry
    '!keep-me',        // a negation re-includes, so it must not become an exclusion
    'build/output',    // nested, so it never names a top-level entry
    '  spaced/  ',
  ].join('\n'));

  assert.ok(isIgnored(ignored, 'node_modules'));
  assert.ok(isIgnored(ignored, '.vscode-test'));
  assert.ok(isIgnored(ignored, 'dist'));
  assert.ok(isIgnored(ignored, 'spaced'), 'surrounding whitespace must be trimmed');

  assert.ok(isIgnored(ignored, 'anything.vsix'), 'globs must be applied, not discarded');
  assert.ok(!isIgnored(ignored, 'keep-me'), 'negations must not exclude');
  assert.ok(!isIgnored(ignored, 'build'), 'nested paths must not exclude a top-level dir');
  assert.ok(!isIgnored(ignored, '# a comment') && !isIgnored(ignored, ''));
});

test('a copy driven by the derived set leaves build output behind', async (t) => {
  // Behavioural check: build a fixture tree, run the same selection the release
  // script runs, and assert on what actually landed.
  const workspace = await mkdtemp(join(tmpdir(), 'cruxide-bundle-'));
  t.after(() => rm(workspace, { force: true, recursive: true }));

  const source = join(workspace, 'source');
  const bundle = join(workspace, 'bundle');
  await mkdir(bundle, { recursive: true });

  for (const dir of ['src', 'scripts', 'node_modules', 'dist', '.vscode-test', 'release']) {
    await mkdir(join(source, dir), { recursive: true });
    await writeFile(join(source, dir, 'file.txt'), dir);
  }
  await writeFile(join(source, 'package.json'), '{}');
  await writeFile(join(source, '.gitignore'), 'node_modules/\n.vscode-test/\ndist/\nrelease/\n*.vsix\n');

  const ignored = deriveIgnoredEntries(await readFile(join(source, '.gitignore'), 'utf8'));
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (shouldCopyEntry(ignored, entry.name)) {
      await cp(join(source, entry.name), join(bundle, entry.name), { recursive: true });
    }
  }

  const copied = (await readdir(bundle)).sort();
  assert.deepEqual(copied, ['.gitignore', 'package.json', 'scripts', 'src']);

  for (const excluded of ['node_modules', 'dist', '.vscode-test', 'release']) {
    assert.ok(!copied.includes(excluded), `${excluded} must not reach the release bundle`);
  }
});

test('the release script uses the shared module rather than its own copy', async () => {
  const script = await readText('scripts/release.mjs');

  assert.match(
    script,
    /import \{ copyFiltered, deriveIgnoredEntries \} from '\.\/release-exclusions\.mjs'/,
    'release.mjs must import the shared exclusion logic',
  );
  assert.match(script, /deriveIgnoredEntries\(gitignore\)/);

  // The copy must go through copyFiltered, which applies the rules at every
  // level. A blanket recursive cp of a kept directory would carry nested
  // node_modules and build output into the archive.
  assert.match(script, /await copyFiltered\(/);
  assert.doesNotMatch(
    script,
    /cp\(join\(projectRoot, entry\.name\)[\s\S]{0,60}recursive: true/,
    'the source tree must not be copied with an unfiltered recursive cp',
  );

  // If the derivation were re-implemented here, the two could diverge again.
  assert.doesNotMatch(
    script,
    /gitignore[\s\S]{0,80}\.split\(/,
    'release.mjs must not re-implement the .gitignore parsing',
  );
});

test('the smoke-test download directory is ignored by git', async () => {
  const gitignore = await readText('.gitignore');
  assert.match(
    gitignore,
    /^\.vscode-test\/$/m,
    '.vscode-test/ must be ignored so a 300 MB editor is never committed or bundled',
  );
});

test('the ignore rules are applied at every level, not only the top', async (t) => {
  // Filtering only top-level names let the recursive copy carry a nested
  // node_modules, dist, or stray artefact through under a kept directory.
  const workspace = await mkdtemp(join(tmpdir(), 'cruxide-nested-'));
  t.after(() => rm(workspace, { force: true, recursive: true }));

  const source = join(workspace, 'source');
  const bundle = join(workspace, 'bundle');

  const files = [
    ['src', 'index.ts'],
    ['src/nested', 'helper.ts'],
    ['src/nested/node_modules/pkg', 'index.js'],   // nested dependency tree
    ['test/fixtures', 'fixture.json'],
    ['test/fixtures/dist', 'bundle.js'],           // nested build output
    ['media', 'logo.png'],
    ['media', 'stray.vsix'],                       // nested artefact, glob rule
  ];
  for (const [dir, name] of files) {
    await mkdir(join(source, dir), { recursive: true });
    await writeFile(join(source, dir, name), name);
  }
  await writeFile(join(source, '.gitignore'), ['node_modules/', 'dist/', '*.vsix', ''].join('\n'));

  const rules = deriveIgnoredEntries(await readFile(join(source, '.gitignore'), 'utf8'));
  const copied = await copyFiltered(rules, { readdir, mkdir, copyFile }, source, bundle, join);

  assert.deepEqual(copied.sort(), [
    '.gitignore',
    'media/logo.png',
    'src/index.ts',
    'src/nested/helper.ts',
    'test/fixtures/fixture.json',
  ]);

  for (const leaked of ['src/nested/node_modules/pkg/index.js', 'test/fixtures/dist/bundle.js', 'media/stray.vsix']) {
    assert.ok(!copied.includes(leaked), `${leaked} must not reach the release bundle`);
  }

  // And the directories themselves must not have been created at all.
  await assert.rejects(readdir(join(bundle, 'src', 'nested', 'node_modules')));
  await assert.rejects(readdir(join(bundle, 'test', 'fixtures', 'dist')));
});
