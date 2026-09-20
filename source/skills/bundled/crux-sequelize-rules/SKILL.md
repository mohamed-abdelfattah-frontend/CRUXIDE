---
name: crux-sequelize-rules
description: Version-aware Sequelize rules for models, associations, queries, transactions, migrations, security, and production operation.
---

# CRUX Sequelize Rules

## Outcome

Version-aware Sequelize rules for models, associations, queries, transactions, migrations, security, and production operation.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the installed Sequelize major version, database dialect and driver, TypeScript configuration, migration tooling, naming conventions, and existing model style before editing.
2. Centralize Sequelize construction, configuration, authentication, logging, pool ownership, and graceful shutdown; do not create ad hoc clients or connections inside request handlers.
3. Define model attributes, creation attributes, nullability, defaults, indexes, timestamps, field mappings, validators, and TypeScript types explicitly without leaking persistence models as API contracts.
4. Name associations and aliases deliberately, define foreign keys and cascade behavior explicitly, bound eager includes, and prevent circular serialization and hidden N+1 access.
5. Pass the transaction object through every participating query, choose isolation and locking from invariants, and use managed transactions or continuation-local context only when project behavior is verified.
6. Use reviewed migrations for production schema changes; never use sync with alter or force in production, and separate destructive changes from compatible deploy and backfill stages.
7. Use bind parameters or replacements for raw SQL, allow-list dynamic identifiers and operators, prevent mass assignment, enforce tenant and resource authorization, and redact sensitive query logs.
8. Tune pools, timeouts, retries, pagination, projections, indexes, and query plans from measurements, then test models, associations, migrations, transactions, concurrency, and supported dialect behavior.

## Official references

- https://sequelize.org/docs/v6/
- https://sequelize.org/docs/v6/other-topics/transactions/
- https://sequelize.org/docs/v6/other-topics/migrations/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
