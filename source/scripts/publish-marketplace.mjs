import assert from 'node:assert/strict';
import { stat, readFile } from 'node:fs/promises';
import { basename, isAbsolute, relative, resolve, sep } from 'node:path';
import { publishVSIX } from '@vscode/vsce';

const projectRoot = resolve(import.meta.dirname, '..');
const releaseRoot = resolve(projectRoot, 'release');
const manifest = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
const requestedPath = process.argv[2];

assert.ok(requestedPath, 'Usage: npm run publish:marketplace -- release/cruxide-VERSION.vsix');
assert.ok(process.env.VSCE_PAT, 'VSCE_PAT is required and must be supplied as a protected secret');

const vsixPath = resolve(projectRoot, requestedPath);
const releaseRelative = relative(releaseRoot, vsixPath);
assert.ok(
  releaseRelative && !releaseRelative.startsWith(`..${sep}`) && releaseRelative !== '..' && !isAbsolute(releaseRelative),
  'The VSIX must be inside the release directory',
);
assert.equal(basename(vsixPath), `${manifest.name}-${manifest.version}.vsix`);
assert.ok((await stat(vsixPath)).isFile(), 'The VSIX path must refer to a file');

await publishVSIX(vsixPath, {
  dependencies: false,
  pat: process.env.VSCE_PAT,
});

console.log(`Published ${manifest.publisher}.${manifest.name} ${manifest.version} to the Visual Studio Marketplace.`);
