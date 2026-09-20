import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryRoot = new URL('../../', import.meta.url);
const { inspectMessage, inspectIdentity, inspectSigner } = await import(
  new URL('scripts/validate-commit-attribution.mjs', repositoryRoot).href
);

/**
 * The guard has to separate two things that both mention the same words:
 * authorship attribution, which is forbidden, and CRUXIDE's product and
 * documentation references to AI tools, which are the point of the product.
 */

test('AI and bot attribution trailers are rejected', () => {
  const rejected = [
    'Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>',
    'Co-authored-by: Claude <noreply@anthropic.com>',
    'CO-AUTHORED-BY: OpenAI ChatGPT <x@openai.com>',
    'Assisted-By: Gemini',
    'Generated-By: GitHub Copilot',
    'Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>',
  ];

  for (const trailer of rejected) {
    const problems = inspectMessage(`fix(scope): subject\n\nBody.\n\n${trailer}\n`);
    assert.ok(problems.length > 0, `must reject: ${trailer}`);
  }
});

test('AI signatures and attribution URLs are rejected', () => {
  const rejected = [
    'Generated with Claude Code',
    '🤖 Generated with Claude',
    'Created by AI.',
    'Co-authored with AI',
    'See https://claude.ai/chat/abc for the session',
  ];

  for (const signature of rejected) {
    const problems = inspectMessage(`fix(scope): subject\n\n${signature}\n`);
    assert.ok(problems.length > 0, `must reject: ${signature}`);
  }
});

test('legitimate product and documentation references are accepted', () => {
  // These are real CRUXIDE commit subjects and bodies. Rejecting them would
  // make the guard unusable in this repository.
  const accepted = [
    'docs: describe Cursor as manual VSIX installation only, not a Cursor Marketplace release',
    'feat(skills): add agent adapters for Codex, Claude Code, GitHub Copilot, Cursor, and Gemini',
    'fix(conductor): describe /crux-conductor as an explicitly invoked skill, not a built-in AI model',
    'chore(deps): map the openai.chatgpt extension id',
    'feat(tracks): add AI Agents & Code Review track with Claude and Copilot tooling',
    'feat: add robot arm telemetry reviewed by Botha',
  ];

  for (const message of accepted) {
    const problems = inspectMessage(`${message}\n`);
    assert.deepEqual(problems, [], `must accept: ${message}`);
  }
});

test('a genuine human co-author is preserved', () => {
  const problems = inspectMessage('fix(scope): subject\n\nCo-Authored-By: Jane Doe <jane@example.com>\n');
  assert.deepEqual(problems, [], 'human co-authors must remain valid');
});

test('tool and bot identities are rejected as author or committer', () => {
  assert.ok(inspectIdentity('author', 'Claude', 'noreply@anthropic.com').length > 0);
  assert.ok(inspectIdentity('committer', 'Claude Opus 5', 'noreply@anthropic.com').length > 0);
  assert.ok(inspectIdentity('author', 'Copilot', 'copilot@github.com').length > 0);
  assert.ok(
    inspectIdentity('author', 'dependabot[bot]', '49699333+dependabot[bot]@users.noreply.github.com')
      .length > 0,
  );
});

test('the repository owner identity is accepted', () => {
  assert.deepEqual(
    inspectIdentity('author', 'Mohammed Khaled Saad', '58882363+MK167@users.noreply.github.com'),
    [],
  );
  assert.deepEqual(
    inspectIdentity('committer', 'Mohammed Khaled Saad', '58882363+MK167@users.noreply.github.com'),
    [],
  );
});

test('the policy is documented in the canonical rules file', async () => {
  const rules = await readFile(new URL('PROJECT_RULES.md', repositoryRoot), 'utf8');
  assert.match(rules, /^## Git Authorship and AI Attribution Policy$/m);

  // The twelve required clauses, each identified by its distinguishing phrase.
  for (const clause of [
    'existing human Git identity',
    'author, committer, co-author, signer',
    'attribution trailers and signatures are forbidden',
    'Before committing, verify the configured identity',
    'Before pushing, audit every new commit',
    'Conventional Commit rules',
    'never directly to `main`',
    'never force-pushed',
    'requires external review',
    'applied only on the PR branch',
    'must never be committed',
    'Stop before committing if the configured identity',
  ]) {
    assert.ok(rules.includes(clause), `PROJECT_RULES.md must state: ${clause}`);
  }

  // Legitimate references must be explicitly protected.
  assert.match(rules, /must not be removed/);
});

test('agent instruction files defer to the canonical rules', async () => {
  for (const file of ['CLAUDE.md', 'AGENTS.md']) {
    const text = await readFile(new URL(file, repositoryRoot), 'utf8');
    assert.match(text, /PROJECT_RULES\.md/, `${file} must reference the canonical rules`);
    assert.match(text, /single source of truth/, `${file} must name the canonical source`);

    // These files repeat the policy as a convenience summary, because an agent
    // that reads only CLAUDE.md still has to get the rule. That is only safe
    // while the precedence is explicit: a bare "adds no rules of its own" next
    // to a list of rules is self-contradictory and invites the two to drift.
    // Prose wraps, so match across line breaks rather than pinning the layout.
    assert.match(
      text,
      /non-normative\s+summary,\s+not\s+a\s+second\s+policy/,
      `${file} must mark its summary as non-normative`,
    );
    assert.match(
      text,
      /that\s+file\s+governs/,
      `${file} must state that PROJECT_RULES.md wins on any difference`,
    );
    assert.match(
      text,
      /Quick reference \(`?PROJECT_RULES\.md`? is authoritative\)/,
      `${file} must label the summary as a quick reference`,
    );
  }
});

test('CI enforces the policy on every pull request', async () => {
  const workflow = await readFile(
    new URL('.github/workflows/governance.yml', repositoryRoot),
    'utf8',
  );
  assert.match(workflow, /name: Commit attribution/);
  assert.match(workflow, /validate-commit-attribution\.mjs/);
  assert.match(workflow, /--range/);
  // The whole PR range must be inspected, not just the tip commit.
  assert.match(workflow, /fetch-depth: 0/);
});

test('a tool signing identity is rejected', () => {
  // PROJECT_RULES.md forbids a tool appearing as signer, not only as author or
  // committer: a commit authored by a human can still be signed by a tool key.
  assert.ok(inspectSigner('Claude', '').length > 0, 'a tool signer name must be rejected');
  assert.ok(inspectSigner('GitHub Copilot', '').length > 0);
  assert.ok(inspectSigner('', 'anthropic-signing-key').length > 0, 'a tool signing key must be rejected');
  assert.ok(inspectSigner('dependabot[bot]', '').length > 0, 'a bot signer must be rejected');
});

test('a human signer and an unsigned commit are both accepted', () => {
  assert.deepEqual(inspectSigner('Mohammed Khaled Saad', 'ABCDEF0123456789'), []);
  // Unsigned commits leave %GS and %GK empty, which is not a violation.
  assert.deepEqual(inspectSigner('', ''), []);
});

test('CI runs the validator from the base revision, not the pull request copy', async () => {
  const workflow = await readFile(new URL('.github/workflows/governance.yml', repositoryRoot), 'utf8');

  // Executing the pull request's own copy would let a change edit the checker
  // and add forbidden trailers in the same commit, so the gate approves itself.
  // Built without regex literals so the shell-sensitive characters stay intact.
  assert.ok(
    workflow.includes('git show "$BASE_SHA:scripts/validate-commit-attribution.mjs"'),
    'the validator must be read from the base revision',
  );
  assert.ok(
    workflow.includes('node "$VALIDATOR"'),
    'the validator copied from base is the one that runs',
  );
  assert.ok(
    !workflow.includes('run: node scripts/validate-commit-attribution.mjs'),
    'the workflow must not execute the checked-out pull request copy directly',
  );
});
