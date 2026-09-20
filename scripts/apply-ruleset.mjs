#!/usr/bin/env node
/**
 * Create or update the "CRUXIDE Main Protection" ruleset on GitHub from
 * CRUXIDE-main-protection.ruleset.json, then read it back and report the
 * enforced state.
 *
 * A ruleset committed to the repository protects nothing. Only a ruleset that
 * exists remotely with enforcement "active" and targeting main does.
 *
 * Usage:
 *   GITHUB_TOKEN=<token> node scripts/apply-ruleset.mjs            # apply, then verify
 *   GITHUB_TOKEN=<token> node scripts/apply-ruleset.mjs --verify   # verify only
 *
 * The token needs "Administration: read and write" on this repository
 * (fine-grained), or the classic "repo" scope. It is read from the environment
 * and never logged.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const OWNER = 'mohamed-abdelfattah-frontend';
const REPO = 'CRUXIDE';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/rulesets`;

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (!token) {
  console.error('Set GITHUB_TOKEN (or GH_TOKEN) to a token with Administration: read and write.');
  process.exit(2);
}

const verifyOnly = process.argv.includes('--verify');
const projectRoot = resolve(import.meta.dirname, '..');
const desired = JSON.parse(
  await readFile(resolve(projectRoot, 'CRUXIDE-main-protection.ruleset.json'), 'utf8'),
);

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    // Report the API's message, never the request headers.
    const detail = body?.message ?? response.statusText;
    const errors = body?.errors ? ` ${JSON.stringify(body.errors)}` : '';
    throw new Error(`${response.status} ${detail}${errors}`);
  }
  return body;
}

const existing = (await api(API)).find((item) => item.name === desired.name);

if (!verifyOnly) {
  if (existing) {
    await api(`${API}/${existing.id}`, { method: 'PUT', body: JSON.stringify(desired) });
    console.log(`Updated ruleset ${existing.id}.`);
  } else {
    const created = await api(API, { method: 'POST', body: JSON.stringify(desired) });
    console.log(`Created ruleset ${created.id}.`);
  }
}

const current = (await api(API)).find((item) => item.name === desired.name);
if (!current) {
  console.error(`No ruleset named "${desired.name}" exists on ${OWNER}/${REPO}.`);
  process.exit(1);
}

const detail = await api(`${API}/${current.id}`);
const rules = new Map(detail.rules.map((rule) => [rule.type, rule.parameters ?? {}]));
const pullRequest = rules.get('pull_request') ?? {};
const statusChecks = rules.get('required_status_checks')?.required_status_checks ?? [];
const included = detail.conditions?.ref_name?.include ?? [];

console.log('');
console.log(`  Ruleset ID:        ${detail.id}`);
console.log(`  Name:              ${detail.name}`);
console.log(`  URL:               https://github.com/${OWNER}/${REPO}/settings/rules/${detail.id}`);
console.log(`  Enforcement:       ${detail.enforcement}`);
console.log(`  Target:            ${detail.target}`);
console.log(`  Included branches: ${included.join(', ') || '(none)'}`);
console.log(`  Bypass actors:     ${(detail.bypass_actors ?? [])
  .map((actor) => `${actor.actor_type}#${actor.actor_id} (${actor.bypass_mode})`)
  .join(', ') || '(none)'}`);
console.log(`  Required approvals:${' '}${pullRequest.required_approving_review_count ?? 0}`);
console.log(`  Code owner review: ${pullRequest.require_code_owner_review ?? false}`);
console.log(`  Stale dismissal:   ${pullRequest.dismiss_stale_reviews_on_push ?? false}`);
console.log(`  Threads resolved:  ${pullRequest.required_review_thread_resolution ?? false}`);
console.log(`  Required checks:   ${statusChecks.map((check) => check.context).join(', ') || '(none)'}`);
console.log(`  Force pushes:      ${rules.has('non_fast_forward') ? 'blocked' : 'ALLOWED'}`);
console.log(`  Branch deletion:   ${rules.has('deletion') ? 'blocked' : 'ALLOWED'}`);
console.log(`  Linear history:    ${rules.has('required_linear_history') ? 'required' : 'not required'}`);
console.log('');

// Verification compares the live ruleset against the declared policy field by
// field. Checking only coarse properties ("is active", "has some checks") would
// report success after someone weakened the ruleset remotely: dropped required
// checks, lowered the approval count, removed code-owner review, or added a
// bypass actor. Each of those leaves a ruleset that is still "active" and still
// "requires pull requests", yet no longer enforces the declared policy.
const problems = [];

// A ruleset that exists but is disabled or evaluate-only protects nothing, and
// neither does one that targets a branch other than the default.
if (detail.enforcement !== 'active') {
  problems.push(`enforcement is "${detail.enforcement}", expected "active"`);
}

// A ruleset retargeted from branches to tags would still look "active" and
// still carry every rule, while protecting no branch at all.
if (detail.target !== desired.target) {
  problems.push(`target is "${detail.target}", expected "${desired.target}"`);
}

const desiredIncluded = desired.conditions?.ref_name?.include ?? [];
for (const ref of desiredIncluded) {
  if (!included.includes(ref)) problems.push(`does not target ${ref} (includes: ${included.join(', ') || 'none'})`);
}

// An exclusion is as effective as removing the include: a ruleset can list
// ~DEFAULT_BRANCH and then exclude it, leaving main unprotected while every
// other check still passes. Only declared exclusions are acceptable.
const desiredExcluded = new Set(desired.conditions?.ref_name?.exclude ?? []);
for (const ref of detail.conditions?.ref_name?.exclude ?? []) {
  if (!desiredExcluded.has(ref)) problems.push(`undeclared branch exclusion: ${ref}`);
}

/**
 * Compare every declared parameter, not a hand-picked subset. Listing keys by
 * hand meant a remotely changed parameter that nobody remembered to add here
 * passed silently: update_allows_fetch_and_merge, allowed_merge_methods,
 * require_last_push_approval and do_not_enforce_on_create were all unchecked.
 *
 * Arrays of required status checks are compared as a subset, because adding a
 * check strengthens protection. Every other value must match exactly.
 */
function compareParameters(ruleType, desiredParameters, liveParameters) {
  for (const [key, expected] of Object.entries(desiredParameters)) {
    const actual = liveParameters?.[key];

    if (key === 'required_status_checks') {
      const live = new Set((actual ?? []).map((check) => check.context));
      for (const { context } of expected) {
        if (!live.has(context)) problems.push(`required status check missing: "${context}"`);
      }
      continue;
    }

    if (Array.isArray(expected)) {
      // Order is not meaningful for these lists, but membership is: a live list
      // that drops or adds an entry changes what the rule permits.
      const same = Array.isArray(actual)
        && expected.length === actual.length
        && [...expected].sort().every((value, index) => value === [...actual].sort()[index]);
      if (!same) {
        problems.push(`${ruleType}.${key} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
      }
      continue;
    }

    // GitHub omits a boolean parameter from the response when it holds the
    // default of false, so an absent value satisfies a declared false. An
    // absent value against a declared true is still a mismatch, which is the
    // direction that matters: that would be a real weakening.
    if (expected === false && actual === undefined) continue;

    if (actual !== expected) {
      problems.push(`${ruleType}.${key} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  }
}

// Every rule type the policy declares must still be present, with matching
// parameters.
const desiredRules = new Map(desired.rules.map((rule) => [rule.type, rule.parameters ?? {}]));
for (const [type, parameters] of desiredRules) {
  if (!rules.has(type)) {
    problems.push(`missing rule: ${type}`);
    continue;
  }
  compareParameters(type, parameters, rules.get(type));
}

const desiredChecks = (desiredRules.get('required_status_checks')?.required_status_checks ?? [])
  .map((check) => check.context);

// Bypass actors are the one place where a difference is always a weakening:
// an actor present remotely but absent from the policy can skip these rules.
const describeActor = (actor) => `${actor.actor_type}#${actor.actor_id}(${actor.bypass_mode})`;
const desiredActors = new Set((desired.bypass_actors ?? []).map(describeActor));
for (const actor of detail.bypass_actors ?? []) {
  if (!desiredActors.has(describeActor(actor))) {
    problems.push(`undeclared bypass actor: ${describeActor(actor)}`);
  }
}

if (problems.length > 0) {
  console.error('Branch protection does NOT match the declared policy:');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('\nRe-apply with: node scripts/apply-ruleset.mjs');
  process.exit(1);
}

console.log(
  `Branch protection verified against CRUXIDE-main-protection.ruleset.json: active, `
  + `targeting ${included.join(', ')}, ${desiredChecks.length} required checks, `
  + `${desiredActors.size} declared bypass actor(s), no undeclared bypass.`,
);
