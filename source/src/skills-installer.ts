import { cp, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import * as vscode from 'vscode';
import type { AgentId, SkillCatalogEntry, SkillInstallRequest, SkillsCatalog } from './skills-types.js';

const SAFE_ID = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const EXCLUDE_START = '# CRUXIDE local skills — managed block';
const EXCLUDE_END = '# End CRUXIDE local skills';
const RULES_CUSTOM_START = '<!-- CRUXIDE:CUSTOM-RULES:START -->';
const RULES_CUSTOM_END = '<!-- CRUXIDE:CUSTOM-RULES:END -->';
const PROJECT_LINK_START = '<!-- CRUXIDE:PROJECT-RULES-LINK:START -->';
const PROJECT_LINK_END = '<!-- CRUXIDE:PROJECT-RULES-LINK:END -->';
const AGENT_RULES_START = '<!-- CRUXIDE:AGENT-RULES:START -->';
const AGENT_RULES_END = '<!-- CRUXIDE:AGENT-RULES:END -->';
const ACCESSIBILITY_STANDARD_RULE_IDS = new Set([
  'crux-wcag-22-rules',
  'crux-bitv-20-rules',
  'crux-bfsg-rules',
]);
const ADAPTER_DIRECTORIES: Readonly<Record<AgentId, string>> = {
  codex: '.agents/skills',
  'claude-code': '.claude/skills',
  copilot: '.github/skills',
  cursor: '.cursor/skills',
  gemini: '.gemini/skills',
  generic: '.agents/skills',
};

export interface InstallResult {
  readonly root: string;
  readonly installed: number;
  readonly external: number;
  readonly adapters: number;
  readonly note: string;
}

export async function installSkills(
  extensionUri: vscode.Uri,
  catalog: SkillsCatalog,
  request: SkillInstallRequest,
): Promise<InstallResult> {
  const selected = resolveInstallSelection(catalog, request.skillIds);
  const workspaceRoot = request.scope === 'user' ? undefined : await selectWorkspaceRoot();
  if (workspaceRoot && !vscode.workspace.isTrusted) {
    throw new Error('Trust this workspace before installing project-local skills.');
  }

  const root = request.scope === 'user' ? join(homedir(), '.cruxide') : join(workspaceRoot as string, '.crux');
  const skillsRoot = join(root, 'skills');
  const externalRoot = join(root, 'external');
  const backupRoot = join(root, 'backups', safeTimestamp());
  await mkdir(skillsRoot, { recursive: true });

  let installed = 0;
  let external = 0;
  let adapters = 0;
  const generatedAdapterPaths: string[] = [];
  const generatedProjectPaths: string[] = [];
  const writtenAdapterPaths = new Set<string>();

  for (const skill of selected) {
    if (skill.source === 'external') {
      await mkdir(externalRoot, { recursive: true });
      await atomicWrite(join(externalRoot, `${skill.id}.md`), externalGuide(skill));
      external += 1;
      continue;
    }

    const source = vscode.Uri.joinPath(extensionUri, 'skills', 'bundled', skill.id).fsPath;
    const destination = confinedJoin(skillsRoot, skill.id);
    if (await exists(destination)) {
      await mkdir(backupRoot, { recursive: true });
      await cp(destination, join(backupRoot, skill.id), { recursive: true, force: true });
      await rm(destination, { recursive: true, force: true });
    }
    await cp(source, destination, { recursive: true, force: false });
    installed += 1;

    for (const agent of new Set(request.agents)) {
      const adapterRoot = request.scope === 'user'
        ? join(homedir(), ADAPTER_DIRECTORIES[agent])
        : join(workspaceRoot as string, ADAPTER_DIRECTORIES[agent]);
      const adapterPath = confinedJoin(adapterRoot, skill.id);
      if (writtenAdapterPaths.has(adapterPath)) continue;
      await mkdir(adapterPath, { recursive: true });
      const canonicalSkill = join(destination, 'SKILL.md');
      await atomicWrite(
        join(adapterPath, 'SKILL.md'),
        adapterDocument(skill, canonicalSkill, join(root, 'PROJECT_RULES.md'), adapterPath),
      );
      if (skill.explicitOnly) {
        await atomicWrite(join(adapterPath, 'agents', 'openai.yaml'), openAiAdapterMetadata(skill));
      }
      generatedAdapterPaths.push(adapterPath);
      writtenAdapterPaths.add(adapterPath);
      adapters += 1;
    }
  }

  const ruleResult = await writeProjectRules(
    extensionUri,
    root,
    workspaceRoot,
    selected,
    request,
    backupRoot,
  );
  generatedProjectPaths.push(...ruleResult.createdProjectPaths);

  await atomicWrite(join(root, 'README.md'), rootReadme(request.scope));
  await atomicWrite(join(root, 'config.json'), `${JSON.stringify({
    schemaVersion: 1,
    scope: request.scope,
    ruleMode: request.ruleMode,
    agents: request.agents,
    projectRules: join(root, 'PROJECT_RULES.md'),
    updatedAt: new Date().toISOString(),
  }, null, 2)}\n`);
  const lockPath = join(root, 'skills.lock.json');
  const lockSkills = new Map((await readLockSkills(lockPath)).map((skill) => [skill.id, skill]));
  for (const { id, name, source, version } of selected) lockSkills.set(id, { id, name, source, version });
  await atomicWrite(lockPath, `${JSON.stringify({
    schemaVersion: 1,
    skills: [...lockSkills.values()].sort((left, right) => left.id.localeCompare(right.id)),
  }, null, 2)}\n`);
  await atomicWrite(join(root, '.gitignore'), localArtifactIgnore());

  if (workspaceRoot && request.scope === 'project-local') {
    await updateGitExclude(workspaceRoot, generatedProjectPaths);
  } else if (workspaceRoot && request.scope === 'project-shared') {
    await clearGitExclude(workspaceRoot);
  }

  const note = external > 0
    ? `${external} external selection(s) were documented for provider review; CRUXIDE did not execute third-party code.`
    : 'Only bundled CRUX skills were installed.';
  return { root, installed, external, adapters, note };
}

export async function uninstallSkills(
  catalog: SkillsCatalog,
  request: SkillInstallRequest,
): Promise<InstallResult> {
  const selected = resolveSelection(catalog, request.skillIds);
  const workspaceRoot = request.scope === 'user' ? undefined : await selectWorkspaceRoot();
  if (workspaceRoot && !vscode.workspace.isTrusted) {
    throw new Error('Trust this workspace before changing project-local skills.');
  }
  const root = request.scope === 'user' ? join(homedir(), '.cruxide') : join(workspaceRoot as string, '.crux');
  const backupRoot = join(root, 'backups', safeTimestamp());
  let removed = 0;
  let external = 0;
  let adapters = 0;

  for (const skill of selected) {
    if (skill.source === 'external') {
      const guide = confinedJoin(join(root, 'external'), skill.id);
      const guidePath = `${guide}.md`;
      if (await exists(guidePath)) { await rm(guidePath, { force: true }); external += 1; }
      continue;
    }
    const destination = confinedJoin(join(root, 'skills'), skill.id);
    if (await exists(destination)) {
      await mkdir(backupRoot, { recursive: true });
      await cp(destination, join(backupRoot, skill.id), { recursive: true, force: true });
      await rm(destination, { recursive: true, force: true });
      removed += 1;
    }
    for (const adapterDirectory of new Set(Object.values(ADAPTER_DIRECTORIES))) {
      const adapterRoot = request.scope === 'user' ? join(homedir(), adapterDirectory) : join(workspaceRoot as string, adapterDirectory);
      const adapterPath = confinedJoin(adapterRoot, skill.id);
      if (await exists(adapterPath)) { await rm(adapterPath, { recursive: true, force: true }); adapters += 1; }
    }
  }

  const lockPath = join(root, 'skills.lock.json');
  if (await exists(lockPath)) {
    const existing: unknown = JSON.parse(await readFile(lockPath, 'utf8'));
    const removedIds = new Set(selected.map((skill) => skill.id));
    const remaining = isLockFile(existing) ? existing.skills.filter((skill) => !removedIds.has(skill.id)) : [];
    await atomicWrite(lockPath, `${JSON.stringify({ schemaVersion: 1, skills: remaining }, null, 2)}\n`);
  }
  return { root, installed: removed, external, adapters, note: 'Selected CRUX-owned files were backed up and removed. Project-authored files were not touched.' };
}

export function createInstallGuide(catalog: SkillsCatalog, request: SkillInstallRequest): string {
  const selected = resolveInstallSelection(catalog, request.skillIds);
  const bundled = selected.filter((skill) => skill.source === 'crux');
  const external = selected.filter((skill) => skill.source === 'external');
  return [
    '# CRUX Skills installation plan',
    '',
    `Scope: ${request.scope}`,
    `Agents: ${request.agents.join(', ')}`,
    `Rules mode: ${request.ruleMode}`,
    '',
    '## Bundled CRUX skills',
    ...(bundled.length ? bundled.map((skill) => `- ${skill.name} (${skill.id})`) : ['- None']),
    '',
    '## Provider-managed skills',
    ...(external.length ? external.map((skill) => `- ${skill.name}: ${skill.sourceUrl ?? 'See its README in CRUXIDE'}`) : ['- None']),
    '',
    'Open **CRUXIDE: Skills Manager** and choose Install Selected. External provider code is never executed silently.',
  ].join('\n');
}

function resolveSelection(catalog: SkillsCatalog, ids: readonly string[]): SkillCatalogEntry[] {
  const byId = new Map(catalog.skills.map((skill) => [skill.id, skill]));
  return ids.map((id) => {
    if (!SAFE_ID.test(id)) {
      throw new Error(`Unsafe skill identifier: ${id}`);
    }
    const skill = byId.get(id);
    if (!skill) {
      throw new Error(`Unknown skill identifier: ${id}`);
    }
    return skill;
  });
}

function resolveInstallSelection(catalog: SkillsCatalog, ids: readonly string[]): SkillCatalogEntry[] {
  const requiredIds = catalog.skills.filter((skill) => skill.required).map((skill) => skill.id);
  return resolveSelection(catalog, [...new Set([...requiredIds, ...ids])]);
}

async function selectWorkspaceRoot(): Promise<string> {
  const folders = vscode.workspace.workspaceFolders?.filter((folder) => folder.uri.scheme === 'file') ?? [];
  if (folders.length === 0) {
    throw new Error('Open a local project folder or choose User scope.');
  }
  if (folders.length === 1) {
    return (folders[0] as vscode.WorkspaceFolder).uri.fsPath;
  }
  const selection = await vscode.window.showQuickPick(
    folders.map((folder) => ({ label: folder.name, description: folder.uri.fsPath, root: folder.uri.fsPath })),
    { placeHolder: 'Choose the project that should receive CRUX Skills' },
  );
  if (!selection) {
    throw new Error('Installation cancelled.');
  }
  return selection.root;
}

function confinedJoin(root: string, id: string): string {
  if (!SAFE_ID.test(id)) {
    throw new Error('Unsafe path segment.');
  }
  const resolvedRoot = resolve(root);
  const target = resolve(resolvedRoot, id);
  if (target !== resolvedRoot && !target.startsWith(`${resolvedRoot}${sep}`)) {
    throw new Error('Installation path escaped its allowed root.');
  }
  return target;
}

async function atomicWrite(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.cruxide-${process.pid}.tmp`;
  await writeFile(temporary, content, { encoding: 'utf8', mode: 0o600 });
  await rm(path, { force: true });
  await rename(temporary, path);
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
      return false;
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

function adapterDocument(
  skill: SkillCatalogEntry,
  canonicalSkill: string,
  canonicalRules: string,
  adapterRoot: string,
): string {
  const displayPath = relative(adapterRoot, canonicalSkill).split(sep).join('/');
  const configPath = relative(adapterRoot, join(dirname(dirname(canonicalSkill)), 'config.json')).split(sep).join('/');
  const rulesPath = relative(adapterRoot, canonicalRules).split(sep).join('/');
  return `---\nname: ${skill.id}\ndescription: ${skill.description}${skill.explicitOnly ? '\ndisable-model-invocation: true' : ''}\n---\n\n# ${skill.name}\n\nRead and follow the canonical CRUX skill at \`${displayPath}\`. Read \`${rulesPath}\` before planning, editing, or reviewing code, then read \`${configPath}\` and honor its \`ruleMode\`.${skill.explicitOnly ? '\n\nRun this skill only after the user explicitly invokes it. Do not activate it automatically.' : ''}\n\nThis adapter contains no executable code and does not install project dependencies. Project instructions and developer overrides take precedence.\n`;
}

function externalGuide(skill: SkillCatalogEntry): string {
  return `# ${skill.name}\n\n${skill.description}\n\n- Source: ${skill.sourceUrl ?? 'Provider documentation'}\n- License: ${skill.license}\n- Network: ${String(skill.permissions.network)}\n- Scripts: ${String(skill.permissions.scripts)}\n- Authentication: ${String(skill.permissions.authentication)}\n\nCRUXIDE recorded this selection but did not download or execute provider code. Review the source, license, requested permissions, and the skill README before installing it with the provider-supported method.${skill.installCommand ? `\n\nSuggested provider command (review before running):\n\n\`\`\`text\n${skill.installCommand}\n\`\`\`` : ''}\n`;
}

function openAiAdapterMetadata(skill: SkillCatalogEntry): string {
  return `interface:\n  display_name: "${skill.name}"\n  short_description: "Coordinate the right skills for one result"\n  default_prompt: "Use $${skill.id} to analyze this prompt, select and coordinate the minimum relevant installed skills, and verify the result."\npolicy:\n  allow_implicit_invocation: false\n`;
}

async function updateGitExclude(workspaceRoot: string, generatedProjectPaths: readonly string[]): Promise<void> {
  const excludePath = await resolveGitExclude(workspaceRoot);
  if (!excludePath) {
    return;
  }
  const current = await readFile(excludePath, 'utf8').catch(() => '');
  const withoutManaged = removeManagedBlock(current);
  const patterns = [
    '/.crux/',
    ...new Set(Object.values(ADAPTER_DIRECTORIES).map((path) => `/${path}/crux-*/`)),
    ...generatedProjectPaths,
  ].sort();
  const block = `${EXCLUDE_START}\n${[...new Set(patterns)].join('\n')}\n${EXCLUDE_END}`;
  await atomicWrite(excludePath, `${withoutManaged.trimEnd()}${withoutManaged.trim() ? '\n\n' : ''}${block}\n`);
}

function isLockFile(value: unknown): value is { readonly skills: Array<{ readonly id: string; readonly [key: string]: unknown }> } {
  return typeof value === 'object' && value !== null && 'skills' in value && Array.isArray(value.skills)
    && value.skills.every((skill: unknown) => typeof skill === 'object' && skill !== null && 'id' in skill && typeof skill.id === 'string');
}

async function readLockSkills(path: string): Promise<Array<{ id: string; name?: string; source?: string; version?: string }>> {
  if (!await exists(path)) return [];
  try {
    const value: unknown = JSON.parse(await readFile(path, 'utf8'));
    return isLockFile(value) ? value.skills : [];
  } catch {
    return [];
  }
}

async function clearGitExclude(workspaceRoot: string): Promise<void> {
  const excludePath = await resolveGitExclude(workspaceRoot);
  if (!excludePath) return;
  const current = await readFile(excludePath, 'utf8').catch(() => '');
  if (!current.includes(EXCLUDE_START)) return;
  await atomicWrite(excludePath, `${removeManagedBlock(current).trimEnd()}\n`);
}

async function resolveGitExclude(workspaceRoot: string): Promise<string | undefined> {
  const dotGit = join(workspaceRoot, '.git');
  try {
    const info = await stat(dotGit);
    if (info.isDirectory()) {
      const path = join(dotGit, 'info', 'exclude');
      await mkdir(dirname(path), { recursive: true });
      return path;
    }
    if (info.isFile()) {
      const marker = await readFile(dotGit, 'utf8');
      const match = /^gitdir:\s*(.+)\s*$/im.exec(marker);
      if (match?.[1]) {
        const gitDirectory = resolve(workspaceRoot, match[1]);
        const path = join(gitDirectory, 'info', 'exclude');
        await mkdir(dirname(path), { recursive: true });
        return path;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function removeManagedBlock(content: string): string {
  const start = content.indexOf(EXCLUDE_START);
  if (start < 0) return content;
  const end = content.indexOf(EXCLUDE_END, start);
  return end < 0 ? content.slice(0, start) : `${content.slice(0, start)}${content.slice(end + EXCLUDE_END.length)}`;
}

function localArtifactIgnore(): string {
  return 'backups/\ncache/\nlogs/\nruntime/\nlocal/\nsecrets/\n*.tmp\n';
}

function rootReadme(scope: SkillInstallRequest['scope']): string {
  return `# CRUX Skills\n\nInstalled scope: **${scope}**. These files guide supported AI agents and do not become application runtime dependencies.\n\nThe canonical generated rules are in \`PROJECT_RULES.md\`. Add project-specific instructions only inside its preserved **Custom Project Rules** section.\n\nProject Local is hidden through \`.git/info/exclude\` without changing the shared \`.gitignore\`. Project Shared may be committed intentionally; local artifacts remain ignored by this folder's own \`.gitignore\`.\n`;
}

async function writeProjectRules(
  extensionUri: vscode.Uri,
  root: string,
  workspaceRoot: string | undefined,
  selected: readonly SkillCatalogEntry[],
  request: SkillInstallRequest,
  backupRoot: string,
): Promise<{ readonly createdProjectPaths: string[] }> {
  const rulesPath = join(root, 'PROJECT_RULES.md');
  const existingRules = await readFile(rulesPath, 'utf8').catch(() => '');
  const customRules = extractCustomRules(existingRules);
  const rules = selected.filter((skill) => skill.source === 'crux' && skill.kind === 'rule-pack');
  const accessibilityStandards = rules.filter((rule) => ACCESSIBILITY_STANDARD_RULE_IDS.has(rule.id));
  const sections: string[] = [];

  for (const rule of rules) {
    const sourcePath = vscode.Uri.joinPath(
      extensionUri, 'skills', 'bundled', rule.id, 'SKILL.md',
    ).fsPath;
    const source = await readFile(sourcePath, 'utf8');
    const workflow = /## Workflow\s+([^]*?)(?=\n## |$)/.exec(source)?.[1]?.trim()
      ?? '- Follow the rule pack README and project overrides.';
    const references = rule.references?.length
      ? `\n\n### Official references\n\n${rule.references.map((reference) => `- ${reference}`).join('\n')}`
      : '';
    const reviewed = rule.lastReviewed ? `; reviewed ${rule.lastReviewed}` : '';
    sections.push(`## ${rule.name}\n\n${rule.description}\n\n**Pack version:** ${rule.version}${reviewed}\n\n**Version policy:** ${rule.versionPolicy ?? 'Follow project-supported versions and repository policy.'}\n\n${workflow}${references}`);
  }

  const modeText: Readonly<Record<SkillInstallRequest['ruleMode'], string>> = {
    guidance: 'Recommendations only. Explain material deviations, but do not block work.',
    warning: 'Flag material deviations before completion and propose a compliant alternative.',
    strict: 'Request compliance before completion unless the developer explicitly approves an exception.',
    custom: 'The Custom Project Rules section and project-authored instructions decide enforcement.',
  };
  const generated = [
    '# CRUX Project Rules',
    '',
    '> Generated from the selected CRUX rule packs. CRUXIDE replaces generated sections on update and preserves the Custom Project Rules section.',
    '',
    `**Rule mode:** ${request.ruleMode} — ${modeText[request.ruleMode]}`,
    '',
    '## Precedence',
    '',
    '1. Explicit developer instructions and repository-owned policy.',
    '2. Custom Project Rules below.',
    '3. Selected CRUX generated rule packs.',
    '4. General recommendations from optional skills.',
    '',
    'Agents must never claim a rule, test, scanner, command, or review ran without evidence.',
    'Agents must inspect the repository language, framework, runtime, and toolchain versions before applying technology-specific guidance. Project-supported versions take precedence; deprecated APIs must not be added to new code unless compatibility requires them and the exception is documented.',
    '',
    '## Selected Rule Packs',
    '',
    ...(rules.length ? rules.map((rule) => `- ${rule.name} (\`${rule.id}\`)`) : ['- No rule packs selected.']),
    '',
    ...(accessibilityStandards.length ? [
      '## Accessibility Standards Composition',
      '',
      `Selected standards: ${accessibilityStandards.map((rule) => rule.name).join(', ')}.`,
      '',
      '- Each selected accessibility pack remains independently enforceable and must be evaluated against its own scope and evidence requirements.',
      '- When multiple packs apply, use the union of applicable requirements and the stricter requirement where they overlap; surface genuine conflicts for an authorized human decision.',
      '- Reuse valid technical test evidence to avoid duplicate work, but do not treat one standard as proof of another or merge their statutory scope, statements, feedback, documentation, or reporting duties.',
      '- Automated tools identify only part of the risk. Formal conformance or legal compliance claims require qualified human accessibility and, for BITV or BFSG, legal review.',
      '',
    ] : []),
    ...sections.flatMap((section) => [section, '']),
    '## Custom Project Rules',
    '',
    RULES_CUSTOM_START,
    customRules,
    RULES_CUSTOM_END,
    '',
  ].join('\n');
  await backupExistingFile(rulesPath, backupRoot, root);
  await atomicWrite(rulesPath, generated);

  if (!workspaceRoot) return { createdProjectPaths: [] };

  const createdProjectPaths: string[] = [];
  const rootLink = join(workspaceRoot, 'PROJECT_RULES.md');
  if (await writeManagedBlock(
    rootLink,
    PROJECT_LINK_START,
    PROJECT_LINK_END,
    `${PROJECT_LINK_START}\n## CRUXIDE Project Rules\n\nThe canonical project rules are in [\`.crux/PROJECT_RULES.md\`](.crux/PROJECT_RULES.md). Agents must read that file before planning, editing, generating, or reviewing code. Add custom rules in its preserved **Custom Project Rules** section.\n${PROJECT_LINK_END}`,
    backupRoot,
    workspaceRoot,
  )) createdProjectPaths.push('/PROJECT_RULES.md');

  const adapterSpecs = agentRuleAdapterSpecs(workspaceRoot, request.agents);
  for (const spec of adapterSpecs) {
    const created = await writeManagedBlock(
      spec.path,
      AGENT_RULES_START,
      AGENT_RULES_END,
      spec.content,
      backupRoot,
      workspaceRoot,
      spec.prefix,
    );
    if (created) {
      const relativePath = relative(workspaceRoot, spec.path).split(sep).join('/');
      createdProjectPaths.push(`/${relativePath}`);
    }
  }
  return { createdProjectPaths };
}

function extractCustomRules(content: string): string {
  const start = content.indexOf(RULES_CUSTOM_START);
  const end = content.indexOf(RULES_CUSTOM_END, start + RULES_CUSTOM_START.length);
  if (start >= 0 && end > start) {
    const preserved = content.slice(start + RULES_CUSTOM_START.length, end).trim();
    if (preserved) return preserved;
  }
  if (content.trim() && !content.includes('Generated from the selected CRUX rule packs')) {
    return `### Preserved pre-existing rules\n\n${content.trim()}`;
  }
  return '- Add project-specific architecture, code-review, naming, security, testing, or delivery rules here. CRUXIDE preserves this section on regeneration.';
}

function agentRuleAdapterSpecs(
  workspaceRoot: string,
  agents: readonly AgentId[],
): Array<{ path: string; content: string; prefix?: string }> {
  const selected = new Set(agents);
  const specs: Array<{ path: string; content: string; prefix?: string }> = [];
  const standard = `${AGENT_RULES_START}\n## CRUXIDE Rules\n\nBefore planning, editing, generating, or reviewing code, read and follow \`.crux/PROJECT_RULES.md\`. Preserve its custom section and follow its configured rule mode. Explicit developer and repository instructions take precedence.\n${AGENT_RULES_END}`;
  if (selected.has('codex') || selected.has('generic')) specs.push({ path: join(workspaceRoot, 'AGENTS.md'), content: standard });
  if (selected.has('claude-code')) specs.push({ path: join(workspaceRoot, 'CLAUDE.md'), content: standard });
  if (selected.has('gemini')) specs.push({ path: join(workspaceRoot, 'GEMINI.md'), content: standard });
  if (selected.has('copilot')) specs.push({ path: join(workspaceRoot, '.github', 'copilot-instructions.md'), content: standard });
  if (selected.has('cursor')) specs.push({
    path: join(workspaceRoot, '.cursor', 'rules', 'crux-project-rules.mdc'),
    prefix: '---\ndescription: Apply CRUXIDE project rules\nalwaysApply: true\n---\n\n',
    content: standard,
  });
  return specs;
}

async function writeManagedBlock(
  path: string,
  startMarker: string,
  endMarker: string,
  block: string,
  backupRoot: string,
  workspaceRoot: string,
  prefix = '',
): Promise<boolean> {
  const existed = await exists(path);
  const current = existed ? await readFile(path, 'utf8') : '';
  await backupExistingFile(path, backupRoot, workspaceRoot);
  const start = current.indexOf(startMarker);
  const end = current.indexOf(endMarker, Math.max(0, start) + startMarker.length);
  let next: string;
  if (start >= 0 && end >= start) {
    next = `${current.slice(0, start)}${block}${current.slice(end + endMarker.length)}`;
  } else {
    next = `${current.trimEnd()}${current.trim() ? '\n\n' : prefix}${block}\n`;
  }
  await atomicWrite(path, next);
  return !existed;
}

async function backupExistingFile(path: string, backupRoot: string, referenceRoot: string): Promise<void> {
  if (!await exists(path)) return;
  const relativePath = relative(referenceRoot, path);
  const safeName = (relativePath && !relativePath.startsWith('..') ? relativePath : basename(path))
    .split(sep).join('__');
  const backupPath = join(backupRoot, 'project-files', safeName);
  if (await exists(backupPath)) return;
  await mkdir(dirname(backupPath), { recursive: true });
  await cp(path, backupPath, { force: false });
}

function safeTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
