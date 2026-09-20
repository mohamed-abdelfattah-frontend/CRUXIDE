import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const workflowsRoot = join(projectRoot, '.github', 'workflows');
const workflowFiles = (await readdir(workflowsRoot))
  .filter((file) => ['.yml', '.yaml'].includes(extname(file)))
  .sort();

assert.ok(workflowFiles.length > 0, 'At least one GitHub Actions workflow is required.');

const violations = [];
for (const file of workflowFiles) {
  const contents = await readFile(join(workflowsRoot, file), 'utf8');

  if (/^\s*permissions:\s*write-all\s*$/mu.test(contents)) {
    violations.push(`${file}: permissions: write-all is forbidden`);
  }

  if (/^\s*pull_request_target\s*:/mu.test(contents)) {
    violations.push(`${file}: pull_request_target is forbidden`);
  }

  for (const [index, line] of contents.split('\n').entries()) {
    const match = line.match(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s*#.*)?$/u);
    if (!match) {
      continue;
    }

    const reference = match[1];
    if (reference.startsWith('./') || reference.startsWith('docker://')) {
      continue;
    }

    const separator = reference.lastIndexOf('@');
    const revision = separator >= 0 ? reference.slice(separator + 1) : '';
    if (!/^[a-f0-9]{40}$/u.test(revision)) {
      violations.push(`${file}:${index + 1}: action must be pinned to a full commit SHA (${reference})`);
    }
  }
}

if (violations.length > 0) {
  throw new Error(`GitHub Actions policy violations:\n- ${violations.join('\n- ')}`);
}

console.log(`Validated ${workflowFiles.length} workflow files: actions are immutable and permissions are scoped.`);
