---
name: crux-sequelize-architecture
description: Build production Sequelize data layers with typed models, explicit associations, safe transactions, migrations, and measurable queries.
---

# CRUX Sequelize Architecture

## Outcome

Build production Sequelize data layers with typed models, explicit associations, safe transactions, migrations, and measurable queries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Sequelize major version, dialect, driver, TypeScript setup, migration tool, model style, and connection lifecycle before editing.
2. Centralize configuration and pool ownership, keep models out of transport contracts, and define attributes, associations, foreign keys, aliases, and cascades explicitly.
3. Carry transaction context through complete use cases and design isolation, locking, retries, optimistic concurrency, and idempotency from business invariants.
4. Use reviewed migrations rather than production sync, parameterize raw queries, constrain dynamic operators, prevent mass assignment, and enforce tenant authorization.
5. Inspect generated SQL and query plans, prevent N+1 loading, bound result sets, redact logs, and test migrations and concurrency on supported dialects.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
