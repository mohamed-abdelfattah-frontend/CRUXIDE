import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { TRACKS_CATALOG } from '../dist/tracks-catalog.js';

const root = resolve(import.meta.dirname, '..');
const sections = TRACKS_CATALOG.tracks.map((track) => {
  const extensionRows = track.extensions.length
    ? track.extensions.map((item) => {
      const platforms = item.platforms?.join(', ') ?? 'Windows, macOS, Linux';
      const note = item.note ?? '';
      return `| \`${item.id}\` | ${item.name} | ${platforms} | ${note} |`;
    }).join('\n')
    : '| — | No extension | — | — |';
  const prerequisites = track.prerequisites.length
    ? track.prerequisites.map((item) => `- ${item}`).join('\n')
    : '- No additional runtime prerequisite declared.';
  return `## ${track.name}${track.required ? ' (required)' : ''}\n\n${track.description}\n\n| Marketplace ID | Tool | Platforms | Note |\n| --- | --- | --- | --- |\n${extensionRows}\n\n**Mapped skills:** ${track.skillIds.map((id) => `\`${id}\``).join(', ') || 'None'}\n\n**Mapped rules:** ${track.ruleIds.map((id) => `\`${id}\``).join(', ') || 'None'}\n\n**Prerequisites**\n\n${prerequisites}`;
});

const content = `# CRUXIDE track-based developer tools\n\nCRUXIDE does not install one fixed extension pack. On first activation, **CRUXIDE Setup** presents every track as selected by default. The developer can uncheck tracks, review the resulting plan, choose agents and rules scope, and approve installation. The same screen can add tracks later.\n\nThe IDs below are fixed in \`src/tracks-catalog.ts\` and validated against the Visual Studio Marketplace during release. Binaries are downloaded by VS Code and are never embedded or republished by CRUXIDE. Existing extensions are preserved, platform-incompatible entries are skipped, and CRUXIDE never intentionally downgrades or silently uninstalls a tool.\n\nCRUXIDE installs editor integrations only. It does not install language runtimes, compilers, SDKs, project packages, Git hooks, database servers, emulators, or provider credentials.\n\n${sections.join('\n\n')}\n\n## Third-party boundary\n\nEach extension retains its publisher's license, privacy policy, permissions, release cycle, and security posture. Marketplace availability and a publisher badge are not substitutes for organizational allowlisting or source review. Provider authentication and subscriptions remain separate from CRUXIDE.\n`;

await writeFile(resolve(root, 'EXTENSIONS.md'), content, 'utf8');
