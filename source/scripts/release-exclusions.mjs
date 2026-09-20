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
 * Credentials and local environment files must never reach a published archive,
 * whatever .gitignore happens to list. The release bundle copies the working
 * tree, so a developer's local secret would otherwise be published by a local
 * `npm run package:release` even though nothing in .gitignore excluded it.
 *
 * This is a safety net that runs in addition to the .gitignore rules, not a
 * replacement for them.
 */
const SENSITIVE_PATTERNS = [
  /^\.env($|\.)/i,
  /^\.npmrc$/i,
  /^\.netrc$/i,
  /^\.git-credentials$/i,
  /^id_(rsa|dsa|ecdsa|ed25519)($|\.)/i,
  /\.(pem|key|p12|pfx|keystore|jks)$/i,
  /^.*\.secrets?(\.|$)/i,
  /^secrets?\.(json|ya?ml|txt)$/i,
];

/** @param {string} name An entry name. */
export function isSensitive(name) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(name));
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
  // Rules naming a nested path, such as "build/output". Since the copy is now
  // recursive, discarding these would let the named directory through.
  const paths = [];

  const lines = gitignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    // Skip blanks, comments, and negations. A negation re-includes a path, so
    // treating it as an exclusion would be exactly backwards.
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('!'))
    .map((line) => (line.endsWith('/') ? line.slice(0, -1) : line))
    .map((line) => (line.startsWith('/') ? line.slice(1) : line))
    .filter((line) => line.length > 0);

  for (const line of lines) {
    // A pattern containing a slash is anchored to the root, which is how git
    // treats it, so match it against the path relative to the bundle root.
    if (line.includes('/')) paths.push(globToRegExp(line));
    else if (line.includes('*') || line.includes('?')) globs.push(globToRegExp(line));
    else names.add(line);
  }

  return { names, globs, paths };
}

/**
 * @param {{names: Set<string>, globs: RegExp[], paths?: RegExp[]}} rules
 * @param {string} name An entry name.
 * @param {string} [relativePath] Path relative to the bundle root, used by
 *   rules that name a nested path. Defaults to the bare name.
 */
export function isIgnored(rules, name, relativePath = name) {
  // Credentials are refused whatever .gitignore happens to list, because the
  // bundle copies the working tree and a local secret would otherwise ship.
  if (isSensitive(name)) return true;
  if (rules.names.has(name)) return true;
  if (rules.globs.some((glob) => glob.test(name))) return true;
  return (rules.paths ?? []).some((path) => path.test(relativePath));
}

/**
 * @param {{names: Set<string>, globs: RegExp[], paths?: RegExp[]}} rules
 * @param {string} name An entry name.
 * @param {string} [relativePath]
 */
export function shouldCopyEntry(rules, name, relativePath = name) {
  return !isIgnored(rules, name, relativePath);
}

/**
 * Copy a directory tree, applying the ignore rules at every level.
 *
 * Filtering only the top level let a nested node_modules, dist, .vscode-test,
 * or a stray artefact under a kept directory reach the published archive,
 * because the recursive copy beneath it was unfiltered.
 *
 * @param {{names: Set<string>, globs: RegExp[]}} rules
 * @param {{readdir: Function, mkdir: Function, copyFile: Function}} fs
 * @param {string} from
 * @param {string} to
 * @param {(...parts: string[]) => string} joinPath
 * @returns {Promise<string[]>} Paths copied, relative to `from`, for testing.
 */
export async function copyFiltered(rules, fs, from, to, joinPath) {
  const copied = [];

  async function walk(sourceDir, targetDir, prefix) {
    await fs.mkdir(targetDir, { recursive: true });
    for (const entry of await fs.readdir(sourceDir, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (isIgnored(rules, entry.name, relative)) continue;
      const source = joinPath(sourceDir, entry.name);
      const target = joinPath(targetDir, entry.name);
      if (entry.isDirectory()) {
        await walk(source, target, relative);
      } else if (entry.isFile()) {
        await fs.copyFile(source, target);
        copied.push(relative);
      }
    }
  }

  await walk(from, to, '');
  return copied;
}
