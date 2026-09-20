#!/usr/bin/env node
/**
 * Reject AI, bot, and tool attribution in Git authorship.
 *
 * Enforces PROJECT_RULES.md -> "Git Authorship and AI Attribution Policy".
 *
 * Usage:
 *   node scripts/validate-commit-attribution.mjs --range origin/main..HEAD
 *   node scripts/validate-commit-attribution.mjs --message .git/COMMIT_EDITMSG
 *   node scripts/validate-commit-attribution.mjs            # defaults to the range above
 *
 * Scope: this checks commit *metadata* only — author, committer, and the
 * attribution trailers in the message. It deliberately does not look at file
 * contents, because CRUXIDE is a tool for AI-assisted development and its
 * features, skills, adapters, and documentation legitimately name Claude,
 * Codex, Copilot, Cursor, and Gemini.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/**
 * Matched on word boundaries, not as substrings, so ordinary words are not
 * mistaken for tool identities. A plain substring test for "bot" would reject
 * a human named Botha and a commit mentioning a robot.
 */
const TOOL_IDENTITY_PATTERN =
  /\b(?:claude|anthropic|chatgpt|openai|copilot|gemini|cursor|codex|bard|devin)\b|\[bot\]|\bbot\b/i;

/**
 * Trailers that assert authorship. A trailer is only a violation when it names
 * a tool identity, so a genuine human co-author stays valid.
 */
const ATTRIBUTION_TRAILERS = ['co-authored-by', 'generated-by', 'assisted-by', 'signed-off-by'];

/** Signature phrases that assert AI authorship regardless of trailer form. */
const SIGNATURE_PATTERNS = [
  /generated\s+(?:with|by)\s+(?:claude|chatgpt|openai|copilot|gemini|cursor|ai\b)/i,
  /created\s+by\s+ai\b/i,
  /co-authored\s+with\s+ai\b/i,
  /\bwritten\s+by\s+(?:claude|chatgpt|an?\s+ai)\b/i,
  /🤖\s*generated/i,
  /https?:\/\/(?:claude\.ai|www\.anthropic\.com|chatgpt\.com|openai\.com)\/\S*/i,
];

const FORBIDDEN_IDENTITY_EMAILS = [
  /@anthropic\.com$/i,
  /@openai\.com$/i,
  /noreply@anthropic\.com$/i,
  /\[bot\]@users\.noreply\.github\.com$/i,
  /^\d+\+.*\[bot\]@/i,
];

const RECORD = '\u001e';
const UNIT = '\u001f';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function namesToolIdentity(text) {
  return TOOL_IDENTITY_PATTERN.test(text);
}

/** @returns {string[]} one message per problem found */
export function inspectMessage(message) {
  const problems = [];

  for (const line of message.split(/\r?\n/)) {
    const trailer = line.match(/^\s*([A-Za-z-]+)\s*:\s*(.+)$/);
    if (trailer && ATTRIBUTION_TRAILERS.includes(trailer[1].toLowerCase())) {
      if (namesToolIdentity(trailer[2])) {
        problems.push(`forbidden attribution trailer: ${line.trim()}`);
      }
    }
  }

  for (const pattern of SIGNATURE_PATTERNS) {
    const match = message.match(pattern);
    if (match) problems.push(`forbidden AI signature: ${match[0].trim()}`);
  }

  return problems;
}

export function inspectIdentity(role, name, email) {
  const problems = [];
  if (namesToolIdentity(name)) {
    problems.push(`${role} name is a tool identity: ${name}`);
  }
  if (FORBIDDEN_IDENTITY_EMAILS.some((pattern) => pattern.test(email))) {
    problems.push(`${role} email is a tool or bot identity: ${email}`);
  }
  return problems;
}

function checkRange(range) {
  const format = ['%H', '%an', '%ae', '%cn', '%ce', '%B'].join(UNIT) + RECORD;
  const raw = git(['log', `--format=${format}`, range]);

  const commits = raw
    .split(RECORD)
    .map((entry) => entry.replace(/^\r?\n/, ''))
    .filter((entry) => entry.trim().length > 0);

  const failures = [];
  for (const entry of commits) {
    const [sha, authorName, authorEmail, committerName, committerEmail, body] = entry.split(UNIT);
    const problems = [
      ...inspectIdentity('author', authorName, authorEmail),
      ...inspectIdentity('committer', committerName, committerEmail),
      ...inspectMessage(body ?? ''),
    ];
    if (problems.length > 0) {
      failures.push({ sha: sha.slice(0, 8), subject: (body ?? '').split('\n')[0], problems });
    }
  }

  return { inspected: commits.length, failures };
}

function main() {
  const args = process.argv.slice(2);
  const messageIndex = args.indexOf('--message');

  if (messageIndex >= 0) {
    const path = args[messageIndex + 1];
    if (!path) {
      console.error('--message requires a file path');
      process.exit(2);
    }
    const problems = inspectMessage(readFileSync(path, 'utf8'));
    if (problems.length > 0) {
      console.error('Commit rejected by the CRUXIDE attribution policy:');
      for (const problem of problems) console.error(`  - ${problem}`);
      console.error('\nSee PROJECT_RULES.md -> Git Authorship and AI Attribution Policy.');
      process.exit(1);
    }
    console.log('Commit message attribution check passed.');
    return;
  }

  const rangeIndex = args.indexOf('--range');
  const range = rangeIndex >= 0 ? args[rangeIndex + 1] : 'origin/main..HEAD';

  let result;
  try {
    result = checkRange(range);
  } catch (error) {
    console.error(`Could not read commits for "${range}": ${error.message.split('\n')[0]}`);
    process.exit(2);
  }

  if (result.failures.length > 0) {
    console.error(`Attribution policy violations in ${range}:\n`);
    for (const failure of result.failures) {
      console.error(`  ${failure.sha}  ${failure.subject}`);
      for (const problem of failure.problems) console.error(`      - ${problem}`);
    }
    console.error('\nSee PROJECT_RULES.md -> Git Authorship and AI Attribution Policy.');
    process.exit(1);
  }

  console.log(
    `Attribution check passed: ${result.inspected} commit(s) in ${range} `
    + 'carry no AI, bot, or tool attribution.',
  );
}

// Only run when invoked directly, so the predicates stay unit-testable.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
