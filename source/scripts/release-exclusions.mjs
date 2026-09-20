/**
 * Which top-level entries are kept out of the release source bundle.
 *
 * This lives in its own module, with no side effects, so the release script and
 * its tests share one implementation. Reproducing the derivation inside a test
 * would let the test keep passing after the real copy path stopped applying it.
 */

/** Escape everything a RegExp treats specially except the glob wildcards. */
function globToRegExp(pattern) {
  const body = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '[^/]*')
    .replaceAll('?', '[^/]');
  return new RegExp(`^${body}$`);
}

/**
 * Derive the ignore rules from .gitignore rather than a second hand-written
 * list. The hand-written list omitted .vscode-test, the VS Code build that the
 * smoke test downloads, so a local package:release bundled a ~300 MB editor.
 *
 * Glob patterns are kept as matchers rather than discarded: dropping them let a
 * stray root-level artefact such as `build.vsix` into the published archive
 * even though `.gitignore` lists `*.vsix`.
 *
 * @param {string} gitignore Contents of the extension's .gitignore.
 * @returns {{names: Set<string>, globs: RegExp[]}} Rules for top-level entries.
 */
export function deriveIgnoredEntries(gitignore) {
  const names = new Set([
    // Not listed in .gitignore, but never part of a source bundle.
    '.git',
    // The output directory the bundle is being written into.
    'release',
  ]);
  const globs = [];

  const lines = gitignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    // Skip blanks, comments, and negations. A negation re-includes a path, so
    // treating it as an exclusion would be exactly backwards.
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('!'))
    .map((line) => (line.endsWith('/') ? line.slice(0, -1) : line))
    // A nested path such as "build/output" never names a top-level entry.
    .filter((line) => line.length > 0 && !line.includes('/'));

  for (const line of lines) {
    if (line.includes('*') || line.includes('?')) globs.push(globToRegExp(line));
    else names.add(line);
  }

  return { names, globs };
}

/**
 * @param {{names: Set<string>, globs: RegExp[]}} rules
 * @param {string} name A top-level entry name.
 */
export function isIgnored(rules, name) {
  return rules.names.has(name) || rules.globs.some((glob) => glob.test(name));
}

/**
 * @param {{names: Set<string>, globs: RegExp[]}} rules
 * @param {string} name A top-level entry name.
 */
export function shouldCopyEntry(rules, name) {
  return !isIgnored(rules, name);
}
