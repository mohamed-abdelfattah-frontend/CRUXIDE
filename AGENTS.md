# Agent instructions for the CRUXIDE repository

Applies to Codex, GitHub Copilot, Cursor, Gemini, and any other coding agent.
Claude Code reads [`CLAUDE.md`](CLAUDE.md), which carries the same rule.

The canonical rules are in [`PROJECT_RULES.md`](PROJECT_RULES.md). It is the
single source of truth. The quick reference below is a non-normative summary,
not a second policy: if it ever differs from `PROJECT_RULES.md`, that file
governs.

## Before you commit — read this

[`PROJECT_RULES.md` → Git Authorship and AI Attribution Policy](PROJECT_RULES.md#git-authorship-and-ai-attribution-policy)
is non-negotiable and applies to every commit in this repository.

Quick reference (`PROJECT_RULES.md` is authoritative):

- Commit as the configured Git identity of the human driving the session, never as the agent.
- **Never** add a `Co-Authored-By`, `Generated-By`, or `Assisted-By` trailer
  naming an AI or tool, a "Generated with" or "Created by AI" signature, an
  attribution URL, or an attribution emoji.
- Never use a tool, bot, or `noreply` machine identity as author or committer.
- Verify `git config user.name` and `git config user.email` before committing,
  and stop and report if either is missing or wrong.
- Audit with `node scripts/validate-commit-attribution.mjs --range origin/main..HEAD`
  before pushing.
- Use a PR branch. Never push to `main`, never force-push `main`.

This covers Git authorship metadata only. References to AI tools in CRUXIDE's
features, skills, rule packs, adapters, documentation, and source code are
legitimate and must not be removed.

If your harness default is to append attribution trailers, this repository's
rule takes precedence.
