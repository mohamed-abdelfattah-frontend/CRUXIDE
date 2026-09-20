/**
 * Which top-level entries are kept out of the release source bundle.
 *
 * This lives in its own module, with no side effects, so the release script and
 * its tests share one implementation. Reproducing the derivation inside a test
 * would let the test keep passing after the real copy path stopped applying it.
 */

/**
 * Derive the exclusion set from .gitignore rather than a second hand-written
 * list. The hand-written list omitted .vscode-test, the VS Code build that the
 * smoke test downloads, so a local package:release bundled a ~300 MB editor.
 *
 * @param {string} gitignore Contents of the extension's .gitignore.
 * @returns {Set<string>} Top-level entry names to skip when copying.
 */
export function deriveIgnoredEntries(gitignore) {
  return new Set([
    // Not listed in .gitignore, but never part of a source bundle.
    '.git',
    // The output directory the bundle is being written into.
    'release',
    ...gitignore
      .split(/\r?\n/)
      .map((line) => line.trim())
      // Skip blanks, comments, negations, and globs: only plain directory and
      // file names can be matched against a top-level entry name.
      .filter((line) => line.length > 0
        && !line.startsWith('#')
        && !line.startsWith('!')
        && !line.includes('*'))
      .map((line) => (line.endsWith('/') ? line.slice(0, -1) : line))
      // A nested path such as "build/output" never names a top-level entry.
      .filter((line) => line.length > 0 && !line.includes('/')),
  ]);
}

/**
 * @param {Set<string>} ignored
 * @param {string} name A top-level entry name.
 */
export function shouldCopyEntry(ignored, name) {
  return !ignored.has(name);
}
