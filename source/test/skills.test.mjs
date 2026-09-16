import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

test('catalog has unique safe entries and every entry has documentation', async () => {
  const catalog = JSON.parse(await readText('skills/catalog.json'));
  assert.equal(catalog.schemaVersion, 1);
  assert.ok(catalog.skills.length >= 75);
  assert.equal(new Set(catalog.skills.map(({ id }) => id)).size, catalog.skills.length);
  for (const skill of catalog.skills) {
    assert.match(skill.id, /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/);
    assert.ok(['crux', 'external'].includes(skill.source));
    assert.ok(skill.permissions);
    await access(new URL(`skills/docs/${skill.id}/README.md`, root));
    if (skill.source === 'crux') {
      await access(new URL(`skills/bundled/${skill.id}/SKILL.md`, root));
      await access(new URL(`skills/bundled/${skill.id}/skill.json`, root));
    }
  }
});

test('catalog covers agreed platforms, review, Archify, ESLint, and Git workflow', async () => {
  const catalog = JSON.parse(await readText('skills/catalog.json'));
  const text = JSON.stringify(catalog).toLowerCase();
  for (const expected of ['angular', 'react', 'next.js', 'react native', 'tailwind', 'shadcn', 'kotlin', 'swift', 'flutter', 'express', 'nestjs', 'coderabbit', 'archify', 'eslint', 'code review']) {
    assert.match(text, new RegExp(expected.replace('.', '\\.')));
  }
  for (const expected of ['php', 'laravel', '.net', 'asp.net core', 'spring boot', 'python ai', 'fastapi', 'django', 'database engineering']) {
    assert.ok(text.includes(expected), `${expected} must be represented in the skills catalog`);
  }
  const gitSkill = await readText('skills/bundled/crux-git-workflow-rules/SKILL.md');
  for (const prefix of ['feat/', 'fix/', 'docs/', 'style/', 'refactor/', 'test/', 'chore/', 'perf/', 'ci/', 'build/']) {
    assert.match(gitSkill, new RegExp(prefix.replace('/', '\\/')));
  }
  assert.match(gitSkill, /Conventional Commits/);
});

test('CRUX Conductor is required, explicit-only, documented, and attributed', async () => {
  const catalog = JSON.parse(await readText('skills/catalog.json'));
  const conductor = catalog.skills.find(({ id }) => id === 'crux-conductor');
  assert.ok(conductor);
  assert.equal(conductor.required, true);
  assert.equal(conductor.explicitOnly, true);
  assert.equal(conductor.tagline, 'One prompt. The right skills. One coordinated result.');
  assert.equal(conductor.intellectualProperty.owner, 'Eng. Mohamed Osama');
  assert.equal(conductor.intellectualProperty.profile, 'https://www.linkedin.com/in/mohamedosama96/');

  const skill = await readText('skills/bundled/crux-conductor/SKILL.md');
  assert.match(skill, /disable-model-invocation: true/);
  assert.match(skill, /structured handoffs/i);
  assert.match(skill, /Eng\. Mohamed Osama/);
  const openAi = await readText('skills/bundled/crux-conductor/agents/openai.yaml');
  assert.match(openAi, /allow_implicit_invocation: false/);

  const readme = await readText('skills/docs/crux-conductor/README.md');
  assert.match(readme, /```mermaid/);
  assert.match(readme, /One coordinated result|single coherent result/i);
  assert.match(readme, /intellectual property rights[\s\S]*belong to/i);
});

test('installer avoids application dependencies and uses private Git exclusion', async () => {
  const source = await readText('src/skills-installer.ts');
  assert.match(source, /\.git\/info\/exclude|join\(dotGit, 'info', 'exclude'\)/);
  assert.match(source, /workspace\.isTrusted/);
  assert.match(source, /Project Local/);
  assert.match(source, /third-party code|provider code/i);
  assert.doesNotMatch(source, /node_modules/);
  assert.doesNotMatch(source, /package\.json/);
  assert.doesNotMatch(source, /child_process|execFile|execSync|spawnSync/);
  assert.match(source, /PROJECT_RULES\.md/);
  assert.match(source, /CRUXIDE:CUSTOM-RULES:START/);
  assert.match(source, /AGENTS\.md/);
  assert.match(source, /CLAUDE\.md/);
  assert.match(source, /copilot-instructions\.md/);
  assert.match(source, /crux-project-rules\.mdc/);
  assert.match(source, /GEMINI\.md/);
});

test('Skills webview keeps scripts local and enforces restrictive CSP', async () => {
  const [panel, script] = await Promise.all([readText('src/skills-panel.ts'), readText('media/skills.js')]);
  assert.match(panel, /default-src 'none'/);
  assert.doesNotMatch(panel, /<script(?!\s+src=)/i);
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|eval\(/);
  assert.doesNotMatch(script, /https?:\/\//i);
});
