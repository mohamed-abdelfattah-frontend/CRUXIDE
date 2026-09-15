import { open, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createVSIX } from '@vscode/vsce';

const projectRoot = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const output = resolve(projectRoot, 'release', `${manifest.name}-${manifest.version}.vsix`);

await createVSIX({
  cwd: projectRoot,
  packagePath: output,
  dependencies: false,
  allowMissingRepository: true,
});

await waitForCompletedWrite(output);
await assertCompleteVsix(output);

async function waitForCompletedWrite(filePath) {
  const deadline = Date.now() + 60_000;
  let previousSize = -1;
  let stableChecks = 0;

  while (Date.now() < deadline) {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    const currentSize = (await stat(filePath)).size;
    stableChecks = currentSize === previousSize ? stableChecks + 1 : 0;
    previousSize = currentSize;

    // VSCE can resolve before its output stream has completely flushed on
    // Windows/Node 24. Five seconds without a size change is long enough to
    // distinguish a completed archive from a temporarily idle stream.
    if (stableChecks >= 20) {
      return;
    }
  }

  throw new Error(`Timed out while waiting for VSIX packaging to finish: ${filePath}`);
}

async function assertCompleteVsix(filePath) {
  const file = await open(filePath, 'r');
  try {
    const fileStat = await file.stat();
    if (fileStat.size < 1_000_000) {
      throw new Error(`Packaged VSIX is unexpectedly small (${fileStat.size} bytes): ${filePath}`);
    }
    const tailSize = Math.min(fileStat.size, 65_557);
    const tail = Buffer.alloc(tailSize);
    await file.read(tail, 0, tailSize, fileStat.size - tailSize);
    const endSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
    const endOffsetInTail = tail.lastIndexOf(endSignature);
    if (endOffsetInTail < 0 || endOffsetInTail + 22 > tail.length) {
      throw new Error(`Packaged VSIX is incomplete: ${filePath}`);
    }

    const absoluteEndOffset = fileStat.size - tailSize + endOffsetInTail;
    const commentLength = tail.readUInt16LE(endOffsetInTail + 20);
    const entryCount = tail.readUInt16LE(endOffsetInTail + 10);
    const centralDirectorySize = tail.readUInt32LE(endOffsetInTail + 12);
    const centralDirectoryOffset = tail.readUInt32LE(endOffsetInTail + 16);

    if (
      entryCount === 0 ||
      absoluteEndOffset + 22 + commentLength !== fileStat.size ||
      centralDirectoryOffset + centralDirectorySize !== absoluteEndOffset
    ) {
      throw new Error(`Packaged VSIX has an invalid ZIP directory: ${filePath}`);
    }

    const centralHeader = Buffer.alloc(4);
    await file.read(centralHeader, 0, 4, centralDirectoryOffset);
    if (!centralHeader.equals(Buffer.from([0x50, 0x4b, 0x01, 0x02]))) {
      throw new Error(`Packaged VSIX has an invalid central directory: ${filePath}`);
    }
  } finally {
    await file.close();
  }
}
