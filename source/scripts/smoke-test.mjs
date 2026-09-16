import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { runTests } from '@vscode/test-electron';

const projectRoot = resolve(import.meta.dirname, '..');
const temporaryRoot = await mkdtemp(join(tmpdir(), 'cruxide-smoke-'));

try {
  await runTests({
    extensionDevelopmentPath: projectRoot,
    extensionTestsPath: join(projectRoot, 'test', 'smoke', 'suite.cjs'),
    launchArgs: [
      '--disable-extensions',
      '--disable-workspace-trust',
      '--skip-release-notes',
      '--skip-welcome',
      '--user-data-dir', join(temporaryRoot, 'user-data'),
      '--extensions-dir', join(temporaryRoot, 'extensions'),
    ],
  });
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
