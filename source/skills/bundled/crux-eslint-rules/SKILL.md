---
name: crux-eslint-rules
description: Optional ESLint guidance that uses existing project configuration without adding dependencies by default.
---

# CRUX ESLint Recommended Rules

## Outcome

Optional ESLint guidance that uses existing project configuration without adding dependencies by default.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Use the repository ESLint flat or legacy configuration when present and do not rewrite it without approval.
2. Run lint only through existing scripts or tools; never claim success without the command result.
3. Treat errors as actionable, warnings according to the selected CRUX mode, and disabled rules as project decisions.
4. Prefer type-aware linting for TypeScript when the repository already provides the required parser configuration.
5. Offer configuration changes as a preview and never install packages or modify package.json automatically.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
