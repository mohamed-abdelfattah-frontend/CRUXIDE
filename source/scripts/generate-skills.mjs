import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { categories, skills } from './skill-definitions.mjs';

const root = resolve(import.meta.dirname, '..');
const skillsRoot = join(root, 'skills');
const bundledRoot = join(skillsRoot, 'bundled');
const docsRoot = join(skillsRoot, 'docs');

await rm(bundledRoot, { recursive: true, force: true });
await rm(docsRoot, { recursive: true, force: true });
await mkdir(bundledRoot, { recursive: true });
await mkdir(docsRoot, { recursive: true });

const publicSkills = skills.map(({ instructions, documentation, diagram, ...skill }) => skill);
await writeFile(
  join(skillsRoot, 'catalog.json'),
  `${JSON.stringify({ schemaVersion: 1, categories, skills: publicSkills }, null, 2)}\n`,
  'utf8',
);

for (const skill of skills) {
  const docsDirectory = join(docsRoot, skill.id);
  await mkdir(docsDirectory, { recursive: true });
  await writeFile(join(docsDirectory, 'README.md'), renderReadme(skill), 'utf8');

  if (skill.source !== 'crux') {
    continue;
  }

  const skillDirectory = join(bundledRoot, skill.id);
  await mkdir(skillDirectory, { recursive: true });
  await writeFile(join(skillDirectory, 'SKILL.md'), renderSkill(skill), 'utf8');
  await writeFile(join(skillDirectory, 'README.md'), renderReadme(skill), 'utf8');
  if (skill.explicitOnly) {
    await mkdir(join(skillDirectory, 'agents'), { recursive: true });
    await writeFile(join(skillDirectory, 'agents', 'openai.yaml'), renderOpenAiMetadata(skill), 'utf8');
  }
  await writeFile(
    join(skillDirectory, 'skill.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      id: skill.id,
      displayName: skill.name,
      category: skill.category,
      kind: skill.kind,
      version: skill.version,
      lastReviewed: skill.lastReviewed,
      versionPolicy: skill.versionPolicy,
      references: skill.references,
      agents: skill.agents,
      permissions: skill.permissions,
      license: skill.license,
      required: skill.required,
      explicitOnly: skill.explicitOnly,
      intellectualProperty: skill.intellectualProperty,
    }, null, 2)}\n`,
    'utf8',
  );
}

await writeFile(join(skillsRoot, 'README.md'), renderCatalogReadme(), 'utf8');

function renderSkill(skill) {
  const workflow = skill.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');
  const references = skill.references?.length
    ? `\n## Official references\n\n${skill.references.map((reference) => `- ${reference}`).join('\n')}\n`
    : '';
  const invocation = skill.explicitOnly
    ? '\n## Invocation\n\n- Run only after explicit user invocation. Do not invoke this skill automatically.\n- Use the command syntax supported by the current agent, such as `/crux-conductor` or `$crux-conductor`.\n'
    : '';
  const ownership = renderOwnership(skill);
  return `---\nname: ${skill.id}\ndescription: ${skill.description}${skill.explicitOnly ? '\ndisable-model-invocation: true' : ''}\n---\n\n# ${skill.name}\n\n## Outcome\n\n${skill.description}\n\n## Version policy\n\n${skill.versionPolicy}\n\nLast reviewed: ${skill.lastReviewed}.\n${invocation}\n## Workflow\n\n${workflow}\n${references}\n## Project control\n\n- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.\n- Project instructions and developer-authored overrides take precedence over CRUX recommendations.\n- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.\n- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.\n${ownership}`;
}

function renderReadme(skill) {
  const permissionRows = Object.entries(skill.permissions)
    .map(([permission, value]) => `| ${title(permission)} | ${String(value)} |`)
    .join('\n');
  const benefits = skill.benefits.map((benefit) => `- ${benefit}`).join('\n');
  const useCases = skill.useCases.length > 0
    ? skill.useCases.map((useCase) => `- ${useCase}`).join('\n')
    : `- Use when the task matches: ${skill.description}`;
  const installation = skill.source === 'crux'
    ? skill.required
      ? `CRUXIDE Skills Manager installs **${skill.name}** automatically whenever any CRUX Skills installation is confirmed. Choose the target agent and Project Local, Project Shared, or User scope. Manual installation copies this folder into the agent's supported skills directory.`
      : `Use CRUXIDE Skills Manager and select **${skill.name}**, the target agent, and Project Local, Project Shared, or User scope. Manual installation copies this folder into the agent's supported skills directory.`
    : `CRUXIDE does not silently repackage or execute this provider's code. Review the provider page and permissions first.${skill.installCommand ? `\n\nCommand template:\n\n\`\`\`text\n${skill.installCommand}\n\`\`\`` : ''}`;
  const tagline = skill.tagline ? `\n> **${skill.tagline}**\n` : '';
  const details = `${tagline}${skill.documentation ? `\n## How it works\n\n${skill.documentation}\n` : ''}`;
  const diagram = skill.diagram ? `\n## Workflow diagram\n\n\`\`\`mermaid\n${skill.diagram}\n\`\`\`\n` : '';
  const invocation = skill.explicitOnly ? '\n## Invocation\n\nThis skill is **explicit-only**. Invoke it with `/crux-conductor` in Claude Code or the equivalent named-skill syntax exposed by the selected agent. It must not run automatically for ordinary prompts.\n' : '';
  const references = skill.references?.length
    ? `\n## Official references\n\n${skill.references.map((reference) => `- ${reference}`).join('\n')}\n`
    : '';
  return `# ${skill.name}\n\n${skill.description}\n${details}${diagram}${invocation}\n## Benefits\n\n${benefits}\n\n## When to use\n\n${useCases}\n\n## Compatibility\n\n- Agents: ${skill.agents.join(', ')}\n- Category: ${skill.category}\n- Type: ${skill.kind}\n- Status: ${skill.status}\n- Required with CRUX Skills installs: ${String(skill.required)}\n- Invocation: ${skill.explicitOnly ? 'explicit only' : 'automatic or explicit when supported'}\n- Source: ${skill.source}\n- Version: ${skill.version}\n- Last reviewed: ${skill.lastReviewed ?? 'Provider-managed'}\n- License: ${skill.license}\n\n## Version policy\n\n${skill.versionPolicy ?? 'Follow the provider-supported compatibility policy for the installed version.'}\n${references}\n## Permissions\n\n| Capability | Requirement |\n| --- | --- |\n${permissionRows}\n\n## Installation\n\n${installation}\n\n## Project impact\n\nCRUXIDE never adds application runtime dependencies automatically. Project Local installs are excluded from Git by default. External runtimes and caches stay outside the application project unless the developer explicitly chooses otherwise.\n\n## Uninstall\n\nUse **CRUXIDE: Manage Skills**, select the installed skill, and choose Uninstall. Review any project-authored changes before removal.\n\n## Source\n\n${skill.sourceUrl ?? 'Developed by CRUX Team and distributed with CRUXIDE.'}\n${renderOwnership(skill)}`;
}

function renderOwnership(skill) {
  if (!skill.intellectualProperty) return '';
  const owner = skill.intellectualProperty;
  return `\n## Intellectual property ownership\n\nThe intellectual property rights in the **${owner.scope}** belong to [${owner.owner}](${owner.profile}), ${owner.role}. Distribution and use of the implementation remain subject to the repository license and any applicable written contributor or ownership agreements.\n`;
}

function renderOpenAiMetadata(skill) {
  return `interface:\n  display_name: "${skill.name}"\n  short_description: "Coordinate the right skills for one result"\n  default_prompt: "Use $${skill.id} to analyze this prompt, select and coordinate the minimum relevant installed skills, and verify the result."\npolicy:\n  allow_implicit_invocation: false\n`;
}

function renderCatalogReadme() {
  const rows = skills
    .map((skill) => `| ${skill.name} | ${skill.category} | ${skill.source} | ${skill.status} |`)
    .join('\n');
  return `# CRUX Skills Catalog\n\nCRUXIDE exposes optional Agent Skills and Recommended Rules. Nothing is installed until the developer selects skills, agents, scope, and confirms the installation plan.\n\n| Skill | Category | Source | Status |\n| --- | --- | --- | --- |\n${rows}\n\nExternal entries remain provider-managed. CRUXIDE shows their source, permissions, license, and manual/provider installation path instead of silently repackaging them.\n`;
}

function title(value) {
  return value.replaceAll('-', ' ').replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}
