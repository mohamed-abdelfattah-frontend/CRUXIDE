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
];

/**
 * A vendor URL standing alone on its own line is the shape an attribution
 * signature takes. The same URL inside a sentence is ordinary documentation:
 * "see https://openai.com/docs for the rate limits" is a legitimate commit
 * message and must not be rejected.
 */
const ATTRIBUTION_URL_LINE =
  /^\s*[-*>\s]*https?:\/\/(?:claude\.ai|claude\.com|www\.anthropic\.com|chatgpt\.com|openai\.com)\/\S*\s*$/i;

/**
 * An identity is rejected on evidence that it is a bot or service account, not
 * because it mentions a brand. "Claude Dupont" is a person, and an engineer at
 * Anthropic or OpenAI commits from a company address like anyone else;
 * rejecting either would block a genuine contributor, which the guard exists
 * to avoid.
 *
 * The whole name must BE a tool identity, optionally with a version or
 * parenthetical suffix, rather than merely containing one.
 */
const TOOL_TOKEN = 'copilot|claude|anthropic|chatgpt|openai|gemini|cursor|codex|bard|devin|github';
const VERSION_TOKEN = 'code|cli|bot|ai|opus|sonnet|haiku|pro|max|mini|turbo|preview|v?\\d[\\w.]*';

/**
 * A name is a tool only when *every* token in it is a product or version word.
 * "OpenAI ChatGPT" and "Claude Opus 5" qualify; "Claude Dupont" and "Gemini
 * Rossi" — both plausible people — do not, because the surname is not a
 * product token. When a tool uses a human-looking name, the machine email
 * address is what identifies it.
 */
const TOOL_NAME_PATTERN = new RegExp(
  `^(?:${TOOL_TOKEN})`
  + `(?:\\s+(?:${TOOL_TOKEN}|${VERSION_TOKEN}))*`
  + '(?:\\s*\\([^)]*\\))?'                   // "(1M context)"
  + '\\s*$',
  'i',
);

/** Machine addresses. A human never commits from one of these. */
const FORBIDDEN_IDENTITY_EMAILS = [
  /^noreply@anthropic\.com$/i,
  /^noreply@openai\.com$/i,
  /^copilot@github\.com$/i,
  /\[bot\]@/i,
  /^\d+\+[^@]*\[bot\]@/i,
  /^bot@/i,
];

const RECORD = '\u001e';
const UNIT = '\u001f';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function namesToolIdentity(text) {
  return TOOL_IDENTITY_PATTERN.test(text);
}

/**
 * C0 control characters other than tab, newline, and carriage return. A commit
 * message has no legitimate use for these, and they defeat naive line matching:
 * `\s` does not match U+001F, so a trailer prefixed with one slips past a
 * `^\s*` anchored pattern while still reading as attribution to a human.
 */
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** @returns {string[]} one message per problem found */
export function inspectMessage(message) {
  const problems = [];

  // Match against a normalised copy so control characters cannot be used to
  // hide a trailer from the line anchors.
  const normalised = message.replace(CONTROL_CHARACTERS, '');

  if (CONTROL_CHARACTERS.test(message)) {
    // Reset lastIndex: the regex is global and test() advances it.
    CONTROL_CHARACTERS.lastIndex = 0;
    problems.push('commit message contains control characters, which are used to hide attribution');
  }
  CONTROL_CHARACTERS.lastIndex = 0;

  for (const line of normalised.split(/\r?\n/)) {
    const trailer = line.match(/^\s*([A-Za-z-]+)\s*:\s*(.+)$/);
    if (trailer && ATTRIBUTION_TRAILERS.includes(trailer[1].toLowerCase())) {
      // Parse the trailer value as "Name <email>" and judge it exactly as an
      // author or committer identity would be judged, so a human co-author
      // called Claude Dupont stays valid.
      const value = trailer[2].trim();
      const parsed = value.match(/^(.*?)\s*<([^>]*)>\s*$/);
      const coAuthorName = (parsed ? parsed[1] : value).trim();
      const coAuthorEmail = parsed ? parsed[2].trim() : '';
      if (isToolIdentity(coAuthorName, coAuthorEmail)) {
        problems.push(`forbidden attribution trailer: ${line.trim()}`);
      }
    }

    if (ATTRIBUTION_URL_LINE.test(line)) {
      problems.push(`forbidden attribution URL: ${line.trim()}`);
    }
  }

  for (const pattern of SIGNATURE_PATTERNS) {
    const match = normalised.match(pattern);
    if (match) problems.push(`forbidden AI signature: ${match[0].trim()}`);
  }

  return problems;
}

/**
 * Whether an identity is a tool or service account, judged on evidence rather
 * than on mentioning a brand. A person named Claude Dupont, and an engineer
 * committing from an @anthropic.com or @openai.com address, are both humans.
 */
export function isToolIdentity(name, email) {
  const cleanName = String(name ?? '').replace(CONTROL_CHARACTERS, '').trim();
  CONTROL_CHARACTERS.lastIndex = 0;
  const cleanEmail = String(email ?? '').replace(CONTROL_CHARACTERS, '').trim();
  CONTROL_CHARACTERS.lastIndex = 0;

  if (/\[bot\]/i.test(cleanName) || /\[bot\]/i.test(cleanEmail)) return true;
  if (FORBIDDEN_IDENTITY_EMAILS.some((pattern) => pattern.test(cleanEmail))) return true;
  return TOOL_NAME_PATTERN.test(cleanName);
}

export function inspectIdentity(role, name, email) {
  const problems = [];

  // Identity fields are contributor-controlled too, so the same control
  // characters that hide a trailer can pad a tool name past a matcher.
  for (const [field, value] of [['name', name], ['email', email]]) {
    if (CONTROL_CHARACTERS.test(String(value ?? ''))) {
      CONTROL_CHARACTERS.lastIndex = 0;
      problems.push(`${role} ${field} contains control characters: ${JSON.stringify(value)}`);
    }
    CONTROL_CHARACTERS.lastIndex = 0;
  }

  if (isToolIdentity(name, email)) {
    problems.push(`${role} is a tool or bot identity: ${name} <${email}>`);
  }
  return problems;
}

/**
 * Inspect the signing identity. PROJECT_RULES.md forbids a tool appearing as
 * signer, not only as author or committer, and a signature carries its own
 * identity: a commit authored by a human can still be signed by a tool key.
 *
 * %GS is the signer name and %GK the key used. Both are empty for an unsigned
 * commit, which is not itself a violation.
 */
export function inspectSigner(signerName, signingKey) {
  const problems = [];
  for (const [field, value] of [['signer', signerName], ['signing key', signingKey]]) {
    if (CONTROL_CHARACTERS.test(String(value ?? ''))) {
      CONTROL_CHARACTERS.lastIndex = 0;
      problems.push(`${field} contains control characters: ${JSON.stringify(value)}`);
    }
    CONTROL_CHARACTERS.lastIndex = 0;
  }
  if (signerName && isToolIdentity(signerName, '')) {
    problems.push(`signed by a tool identity: ${signerName}`);
  }
  if (signingKey && namesToolIdentity(signingKey)) {
    problems.push(`signed with a tool key: ${signingKey}`);
  }
  return problems;
}

function checkRange(range) {
  // Commit messages, author names, and emails are all contributor-controlled.
  // Any printable delimiter can therefore be forged: placing one inside a
  // message would shift the field boundaries and push a forbidden trailer out
  // of the part that gets inspected, silently passing the gate.
  //
  // NUL is the only byte git cannot store in a commit message or identity, so
  // it is the only delimiter a contributor cannot inject. Commits are listed by
  // SHA first, which is plain hex and unambiguous, then read one at a time.
  const shas = git(['log', '--format=%H', range])
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[0-9a-f]{40}$/.test(line));

  const failures = [];
  for (const sha of shas) {
    const fields = ['%an', '%ae', '%cn', '%ce', '%GS', '%GK', '%B'].join('%x00');
    const raw = git(['show', '-s', `--format=${fields}`, sha]);

    const parts = raw.split('\0');
    const [authorName, authorEmail, committerName, committerEmail, signerName, signingKey] = parts;
    // The body is last, so anything after the sixth delimiter belongs to it.
    // Rejoining is belt and braces: NUL cannot occur inside a message.
    const body = parts.slice(6).join('\0');

    const problems = [
      ...inspectIdentity('author', authorName ?? '', authorEmail ?? ''),
      ...inspectIdentity('committer', committerName ?? '', committerEmail ?? ''),
      ...inspectSigner(signerName ?? '', signingKey ?? ''),
      ...inspectMessage(body),
    ];
    if (problems.length > 0) {
      failures.push({ sha: sha.slice(0, 8), subject: body.split('\n')[0], problems });
    }
  }

  return { inspected: shas.length, failures };
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
