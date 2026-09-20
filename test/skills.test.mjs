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
  for (const expected of ['php', 'laravel', '.net', 'asp.net core', 'spring boot', 'python ai', 'fastapi', 'django', 'database engineering', 'nosql', 'mongodb', 'redis', 'orm', 'sequelize', 'prisma', 'typeorm', 'mongoose']) {
    assert.ok(text.includes(expected), `${expected} must be represented in the skills catalog`);
  }
  const gitSkill = await readText('skills/bundled/crux-git-workflow-rules/SKILL.md');
  for (const prefix of ['feat/', 'fix/', 'docs/', 'style/', 'refactor/', 'test/', 'chore/', 'perf/', 'ci/', 'build/']) {
    assert.match(gitSkill, new RegExp(prefix.replace('/', '\\/')));
  }
  assert.match(gitSkill, /Conventional Commits/);
});

test('technology rules are version-aware, current, sourced, and substantial', async () => {
  const { skills } = await import('../scripts/skill-definitions.mjs');
  const technologyRules = skills.filter(({ tags = [] }) => tags.includes('technology-rules'));
  assert.ok(technologyRules.length >= 20);
  for (const rule of technologyRules) {
    assert.equal(rule.source, 'crux');
    assert.equal(rule.kind, 'rule-pack');
    assert.equal(rule.version, '1.1.0');
    assert.equal(rule.lastReviewed, '2026-09-16');
    assert.match(rule.versionPolicy, /Detect the repository language, framework, runtime, and toolchain versions/i);
    assert.ok(rule.instructions.length >= 7, `${rule.id} needs production-grade coverage`);
    assert.ok(rule.instructions.every((instruction) => instruction.length >= 40), `${rule.id} contains a shallow rule`);
    assert.ok(rule.references.every((reference) => reference.startsWith('https://')));
  }

  const catalog = JSON.parse(await readText('skills/catalog.json'));
  const expected = [
    'crux-solution-architecture-rules', 'crux-technical-lead-rules',
    'crux-typescript-javascript-rules', 'crux-web-platform-rules', 'crux-angular-rules',
    'crux-react-rules', 'crux-nextjs-rules', 'crux-react-native-rules',
    'crux-kotlin-android-rules', 'crux-swift-ios-rules', 'crux-dart-flutter-rules',
    'crux-nodejs-rules', 'crux-express-rules', 'crux-nestjs-rules',
    'crux-php-rules', 'crux-laravel-rules', 'crux-csharp-dotnet-rules',
    'crux-java-spring-rules', 'crux-go-rules', 'crux-rust-rules',
    'crux-python-rules', 'crux-sql-database-rules', 'crux-nosql-database-rules',
    'crux-orm-rules', 'crux-sequelize-rules', 'crux-container-cicd-rules',
    'crux-ai-rag-production-rules',
  ];
  const catalogIds = new Set(catalog.skills.map(({ id }) => id));
  for (const id of expected) assert.ok(catalogIds.has(id), `${id} must be generated`);
});

test('WCAG, BITV, and BFSG are independent and composable accessibility rule packs', async () => {
  const { skills } = await import('../scripts/skill-definitions.mjs');
  const expected = ['crux-wcag-22-rules', 'crux-bitv-20-rules', 'crux-bfsg-rules'];
  const rules = expected.map((id) => skills.find((skill) => skill.id === id));
  for (const [index, rule] of rules.entries()) {
    assert.ok(rule, `${expected[index]} must exist`);
    assert.equal(rule.source, 'crux');
    assert.equal(rule.kind, 'rule-pack');
    assert.equal(rule.category, 'Accessibility Standards');
    assert.equal(rule.required, false);
    assert.ok(rule.tags.includes('independently-selectable'));
    assert.ok(rule.instructions.length >= 10, `${rule.id} needs standalone coverage`);
    assert.ok(rule.instructions.every((instruction) => instruction.length >= 80), `${rule.id} contains a shallow rule`);
    assert.ok(rule.references.length >= 3);
  }
  assert.match(rules[0].instructions.join(' '), /automated score|automated tools/i);
  assert.match(rules[1].instructions.join(' '), /accessibility statement/i);
  assert.match(rules[1].instructions.join(' '), /German Sign Language and Easy German/i);
  assert.match(rules[2].instructions.join(' '), /28 June 2025/i);
  assert.match(rules[2].instructions.join(' '), /market-surveillance/i);

  const installer = await readText('src/skills-installer.ts');
  assert.match(installer, /Accessibility Standards Composition/);
  assert.match(installer, /union of applicable requirements/);
  assert.match(installer, /do not treat one standard as proof of another/);
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
