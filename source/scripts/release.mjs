import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { chmod, cp, mkdir, open, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { join, relative, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { ZipFile } from 'yazl';

const projectRoot = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const releaseRoot = join(projectRoot, 'release');
const bundleName = `CRUXIDE-v${manifest.version}`;
const stagingRoot = join(releaseRoot, bundleName);
const sourceRoot = join(stagingRoot, 'source');
const vsixName = `${manifest.name}-${manifest.version}.vsix`;
const zipPath = join(releaseRoot, `${bundleName}.zip`);

await rm(stagingRoot, { force: true, recursive: true });
await mkdir(stagingRoot, { recursive: true });

const releaseFiles = [
  [join(releaseRoot, vsixName), join(stagingRoot, vsixName)],
  [join(projectRoot, 'installers', 'install-windows.ps1'), join(stagingRoot, 'install-windows.ps1')],
  [join(projectRoot, 'installers', 'install-macos.sh'), join(stagingRoot, 'install-macos.sh')],
  [join(projectRoot, 'installers', 'INSTALL.md'), join(stagingRoot, 'INSTALL.md')],
  [join(projectRoot, 'README.md'), join(stagingRoot, 'README.md')],
  [join(projectRoot, 'EXTENSIONS.md'), join(stagingRoot, 'EXTENSIONS.md')],
  [join(projectRoot, 'media', 'cruxide.ico'), join(stagingRoot, 'cruxide.ico')],
  [join(projectRoot, 'media', 'crux-logo.png'), join(stagingRoot, 'crux-logo.png')],
];

for (const [source, destination] of releaseFiles) {
  await cp(source, destination);
}
await cp(join(projectRoot, 'installers', 'fonts'), join(stagingRoot, 'fonts'), { recursive: true });
await chmod(join(stagingRoot, 'install-macos.sh'), 0o755);

await mkdir(sourceRoot, { recursive: true });
// Derive the exclusions from .gitignore rather than maintaining a second list.
// The hand-written set omitted .vscode-test, the VS Code build that the smoke
// test downloads, so a local package:release after npm run smoke:test bundled a
// ~300 MB editor into the release archive.
const gitignore = await readFile(join(projectRoot, '.gitignore'), 'utf8');
const ignoredSourceEntries = new Set([
  '.git',
  'release',
  ...gitignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.includes('*'))
    .map((line) => (line.endsWith('/') ? line.slice(0, -1) : line)),
]);
const sourceEntries = await readdir(projectRoot, { withFileTypes: true });
for (const entry of sourceEntries) {
  if (!ignoredSourceEntries.has(entry.name)) {
    await cp(join(projectRoot, entry.name), join(sourceRoot, entry.name), { recursive: true });
  }
}

const checksumTargets = [
  join(stagingRoot, vsixName),
  join(stagingRoot, 'cruxide.ico'),
  join(stagingRoot, 'crux-logo.png'),
  join(stagingRoot, 'fonts', 'RobotoMono-Variable.ttf'),
  join(stagingRoot, 'fonts', 'RobotoMono-Italic-Variable.ttf'),
];
const checksumLines = [];
for (const filePath of checksumTargets) {
  const manifestPath = relative(stagingRoot, filePath).split(sep).join('/');
  checksumLines.push(`${await sha256(filePath)}  ${manifestPath}`);
}
await writeFile(join(stagingRoot, 'SHA256SUMS.txt'), `${checksumLines.sort().join('\n')}\n`, 'utf8');

await rm(zipPath, { force: true });
await createDeterministicZip(stagingRoot, zipPath, bundleName);
console.log(`Created ${relative(projectRoot, zipPath)}`);

async function sha256(filePath) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

async function createDeterministicZip(directory, destination, rootName) {
  const zip = new ZipFile();
  const output = createWriteStream(destination, { mode: 0o644 });
  const closed = once(output, 'close');
  const completion = pipeline(zip.outputStream, output);
  const fixedTime = new Date('2020-01-01T00:00:00.000Z');

  for (const filePath of await walk(directory)) {
    const fileStat = await stat(filePath);
    const archivePath = `${rootName}/${relative(directory, filePath).split(sep).join('/')}`;
    zip.addFile(filePath, archivePath, {
      mtime: fixedTime,
      mode: fileStat.mode,
      compress: true,
    });
  }

  zip.end();
  await completion;
  await closed;
  await assertZipComplete(destination);
}

async function assertZipComplete(filePath) {
  const file = await open(filePath, 'r');
  try {
    const fileStat = await file.stat();
    const tailSize = Math.min(fileStat.size, 65_557);
    const tail = Buffer.alloc(tailSize);
    await file.read(tail, 0, tailSize, fileStat.size - tailSize);
    if (tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])) < 0) {
      throw new Error(`Release archive is incomplete: ${filePath}`);
    }
  } finally {
    await file.close();
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      paths.push(...await walk(path));
    } else if (entry.isFile()) {
      paths.push(path);
    }
  }
  return paths;
}
