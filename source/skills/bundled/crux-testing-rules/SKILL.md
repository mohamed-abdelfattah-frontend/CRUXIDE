---
name: crux-testing-rules
description: Optional rules requiring proportionate, behavior-focused verification.
---

# CRUX Testing Rules

## Outcome

Optional rules requiring proportionate, behavior-focused verification.

## Workflow

1. A bug fix should include a regression test when the behavior can be reproduced deterministically.
2. A behavior or contract change should update its tests and documentation.
3. Do not delete, skip, weaken, or rewrite tests merely to make a failing check pass.
4. Use the lowest reliable test layer and add integration or E2E coverage only where boundaries require it.
5. Report executed, failed, skipped, and unavailable checks accurately.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
