---
name: crux-git-workflow-rules
description: Optional branch and Conventional Commit naming rules with configurable warning or strict enforcement.
---

# CRUX Git Workflow Rules

## Outcome

Optional branch and Conventional Commit naming rules with configurable warning or strict enforcement.

## Workflow

1. Use branch prefixes feat/, fix/, docs/, style/, refactor/, test/, chore/, perf/, ci/, or build/.
2. Use lowercase kebab-case branch descriptions; an optional project ticket may follow the prefix.
3. Treat main, develop, and stage as protected permanent branch names; release/ and hotfix/ are optional project extensions.
4. Follow Conventional Commits and format commits as type(scope): description using the same types; scope is optional unless project configuration requires it.
5. Use ! or a BREAKING CHANGE footer for intentional breaking changes and never create commits without explicit authorization.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
