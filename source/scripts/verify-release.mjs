import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const [manifest, lockfile, changelog, securityPolicy] = await Promise.all([
  readJson('package.json'),
  readJson('package-lock.json'),
  readFile(join(projectRoot, 'CHANGELOG.md'), 'utf8'),
  readFile(join(projectRoot, 'SECURITY.md'), 'utf8'),
]);

const requestedTag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
if (requestedTag) {
  assert.equal(requestedTag, `v${manifest.version}`, `Release tag must be v${manifest.version}`);
}

assert.equal(manifest.private, true, 'The npm package must remain private');
assert.equal(manifest.publisher, 'cruxcode');
assert.equal(manifest.repository?.url, 'https://github.com/mohamed-abdelfattah-frontend/CRUXIDE.git');
assert.equal(manifest.homepage, 'https://www.cruxcode.dev');
assert.equal(manifest.bugs?.url, 'https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/issues');
assert.equal(lockfile.version, manifest.version);
assert.equal(lockfile.packages[''].version, manifest.version);
assert.match(changelog, new RegExp(`^## ${escapeRegex(manifest.version)} - \\d{4}-\\d{2}-\\d{2}$`, 'm'));
assert.match(securityPolicy, /security\/advisories\/new/);
assert.doesNotMatch(securityPolicy, /distribution should remain private/i);

console.log(`Release metadata verified for CRUXIDE ${manifest.version}.`);

async function readJson(path) {
  return JSON.parse(await readFile(join(projectRoot, path), 'utf8'));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
