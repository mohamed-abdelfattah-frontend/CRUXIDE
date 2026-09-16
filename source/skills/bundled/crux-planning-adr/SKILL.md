---
name: crux-planning-adr
description: Turn requirements into implementation plans and durable architecture decision records.
---

# CRUX Planning & ADR

## Outcome

Turn requirements into implementation plans and durable architecture decision records.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Inspect the relevant repository context before planning and call out missing decisions rather than inventing them.
2. Break work into independently verifiable slices with prerequisites, risks, tests, and rollback notes.
3. Use ADRs for consequential decisions and record context, decision, alternatives, consequences, and status.
4. Keep plans synchronized with actual implementation progress and preserve unresolved questions.
5. Do not turn recommendations into mandatory project policy unless the developer explicitly selects strict mode.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
