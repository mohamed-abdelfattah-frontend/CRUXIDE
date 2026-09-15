---
name: crux-documentation
description: Create accurate READMEs, runbooks, handovers, API guides, and architecture documentation.
---

# CRUX Documentation

## Outcome

Create accurate READMEs, runbooks, handovers, API guides, and architecture documentation.

## Workflow

1. Derive commands, paths, configuration, and behavior from the repository rather than assumptions.
2. Document prerequisites, setup, verification, failure recovery, security, and ownership.
3. Separate quick-start guidance from detailed reference material.
4. Use examples that are runnable and contain no secrets or environment-specific credentials.
5. Keep documentation aligned with the current implementation and identify unverified statements.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
