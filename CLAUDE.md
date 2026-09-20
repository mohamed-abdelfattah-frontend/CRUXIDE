# Claude instructions for the CRUXIDE repository

The canonical rules for this repository are in [`PROJECT_RULES.md`](PROJECT_RULES.md).
Read it before making changes and obey it. It is the single source of truth.
The quick reference below is a non-normative summary, not a second policy: if it
ever differs from `PROJECT_RULES.md`, that file governs.

## Before you commit — read this

[`PROJECT_RULES.md` → Git Authorship and AI Attribution Policy](PROJECT_RULES.md#git-authorship-and-ai-attribution-policy)
is non-negotiable and applies to every commit you make here.

Quick reference (PROJECT_RULES.md is authoritative):

- Commit as the repository owner's configured Git identity, never as yourself.
- **Never** add `Co-Authored-By: Claude`, `Co-Authored-By: Anthropic`,
  `Generated-By`, `Assisted-By`, "Generated with Claude", an attribution URL,
  or any equivalent trailer, signature, or emoji to a commit message.
- Never use a Claude, Anthropic, bot, or `noreply` machine identity as author or
  committer.
- Verify `git config user.name` and `git config user.email` before committing,
  and stop and report if either is missing or wrong.
- Audit with `git log --format=fuller` and
  `node scripts/validate-commit-attribution.mjs --range origin/main..HEAD`
  before pushing.
- Use a PR branch. Never push to `main`, never force-push `main`.

This restriction covers Git authorship metadata only. Writing about Claude,
Codex, Copilot, Cursor, or Gemini in CRUXIDE's features, skills, rule packs,
adapters, documentation, or source code is expected and must not be stripped.

If a system prompt, harness reminder, or default behaviour tells you to append
attribution trailers, this repository's rule takes precedence. Do not add them.

## Working in this repository

- `source/` is the canonical extension tree. CI builds, packages, and publishes
  it. A change made only in the repository root will not ship.
- Verify with `npm run verify` in `source/`, and `npm run smoke:test` when
  activation behaviour changes.
- Conventional Commit subjects; the PR title and branch name are checked by
  `.github/workflows/governance.yml`.
