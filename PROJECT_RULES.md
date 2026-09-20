# CRUXIDE Project Rules

Canonical engineering rules for the CRUXIDE repository itself.

This file is the single source of truth. Agent-specific instruction files
(`CLAUDE.md`, `AGENTS.md`) reference it and must not restate or override it.

> Not to be confused with the `.crux/PROJECT_RULES.md` that CRUXIDE generates
> **into a consumer's project** from the selected rule packs. That generated
> file is a product output. This file governs work on CRUXIDE's own repository.

---

## Git Authorship and AI Attribution Policy

Non-negotiable. Applies to every commit in this repository, whether written by
a human, an AI assistant, or any automation.

1. **All commits created during an AI-assisted session use the repository's
   existing human Git identity.** The assistant commits as the human who is
   driving the session, never as itself.

   This is not a single-author rule. External contributors commit under their
   own identity as normal; `scripts/validate-commit-attribution.mjs`
   deliberately accepts any human identity and rejects only AI, bot, and tool
   identities, so the guard never blocks a genuine contributor.

2. **No AI or tool may appear as author, committer, co-author, signer,
   contributor, or attribution** in Git metadata or commit messages.

3. **AI attribution trailers and signatures are forbidden.** This includes, case
   insensitively, `Co-Authored-By`, `Generated-By`, and `Assisted-By` trailers
   naming Claude, Anthropic, ChatGPT, OpenAI, Copilot, Gemini, Cursor, or any
   bot or tool identity; phrases such as "Generated with", "Created by AI", or
   "Co-authored with AI"; tool attribution URLs; and AI attribution emojis or
   signatures. Tool-specific, bot, and `noreply` machine identities must not be
   used as author or committer.

4. **Before committing, verify the configured identity:**

   ```bash
   git config user.name    # must be: Mohammed Khaled Saad
   git config user.email   # must be: 58882363+MK167@users.noreply.github.com
   ```

5. **Before pushing, audit every new commit:**

   ```bash
   git log --format=fuller origin/main..HEAD
   node scripts/validate-commit-attribution.mjs --range origin/main..HEAD
   ```

6. **Commit messages follow CRUXIDE Conventional Commit rules**, matching the
   PR title policy enforced in `.github/workflows/governance.yml`:
   `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`,
   `style`, `test`.

7. **Pushes go through a pull-request branch, never directly to `main`.**

8. **`main` is never force-pushed**, and neither is any protected or release
   branch. A history rewrite is confined to an unmerged PR branch, is
   explicitly authorised by the repository owner, uses
   `git push --force-with-lease`, and is preceded by a timestamped local
   recovery reference.

9. **Every pushed change requires external review** before merge, whoever or
   whatever authored it. Human, Dependabot, and agent-authored changes take the
   same path.

10. **Safe review fixes are applied only on the PR branch**, never on `main`.
    Only deterministic, low-risk corrections are automated; anything touching
    architecture, security, permissions, credentials, publishing, or breaking
    behaviour requires owner approval.

11. **Secrets, tokens, temporary files, logs, build artifacts, and unrelated
    user changes must never be committed.** Stage deliberately and inspect the
    staged set before every commit.

12. **Stop before committing if the configured identity is missing or
    incorrect.** Do not guess, do not fall back to a default, and do not commit
    with a tool identity. Report the problem instead.

### What this policy does not restrict

This policy governs **Git authorship, commit attribution, generated signatures,
and equivalent metadata only**.

Legitimate references to AI technologies elsewhere are expressly allowed and
must not be removed: product features, agent adapters for Codex, Claude Code,
GitHub Copilot, Cursor and Gemini, skill and rule-pack content, extension IDs,
dependencies, documentation, changelog entries, and source code. CRUXIDE is a
tool for AI-assisted development; describing that is not attribution.

### Enforcement

`scripts/validate-commit-attribution.mjs` checks commit messages and author and
committer identity. It runs in two places:

- **CI**, as the `Commit attribution` job in `.github/workflows/governance.yml`,
  over every commit in a pull request. This is the authoritative gate, because
  it cannot be bypassed locally.
- **Optionally as a local `commit-msg` hook**, for faster feedback:

  ```bash
  git config core.hooksPath .githooks
  ```

  Hooks are per-clone and can be skipped with `--no-verify`, so the CI check
  remains the control that actually enforces this policy.

---

## Release rules

- `source/` is the canonical extension tree. CI builds, packages, and publishes
  it. Changes made only in the repository root do not ship.
- The release version must match across `source/package.json`,
  `source/package-lock.json`, the root manifests, the changelog heading, and
  every installer and README reference.
- Never tag, release, or publish while versions disagree.
- Never publish from an unverified commit, and never disable a failing check to
  complete a release.
