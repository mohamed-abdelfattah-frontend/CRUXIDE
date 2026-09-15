---
name: crux-base-quality-rules
description: Optional baseline rules for readable, typed, maintainable, and verifiable code.
---

# CRUX Base Code Quality Rules

## Outcome

Optional baseline rules for readable, typed, maintainable, and verifiable code.

## Workflow

1. Prefer explicit types and contracts at boundaries; avoid unchecked any-like escapes without a documented reason.
2. Keep functions and modules focused, names intention-revealing, and side effects visible.
3. Handle errors intentionally and remove dead code, debug output, secrets, and commented-out implementations.
4. Preserve existing public behavior unless the change explicitly updates the contract.
5. Add or update meaningful tests for behavior changes and report checks that were not executed.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
