---
name: crux-orm-rules
description: ORM rules for explicit mappings, query behavior, transactions, migrations, security, performance, and database-native escape hatches.
---

# CRUX ORM & Data Access Rules

## Outcome

ORM rules for explicit mappings, query behavior, transactions, migrations, security, performance, and database-native escape hatches.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the ORM, exact major version, database dialect, driver, migration tool, generated-client workflow, and repository data-access conventions before selecting APIs or patterns.
2. Keep domain and application behavior independent from ORM entities and generated clients; make repository, unit-of-work, and transaction boundaries explicit where the architecture requires them.
3. Define columns, nullability, keys, relations, ownership, cascades, constraints, precision, time zones, enums, and naming deliberately instead of relying on unsafe ORM defaults.
4. Control query shape with explicit projections, eager or lazy loading policy, stable pagination, batching, and bounded relations; detect N+1 queries and inspect generated SQL for critical paths.
5. Select transaction isolation, locking, optimistic concurrency, retries, and idempotency from business invariants, and pass transaction context through every participating data operation.
6. Generate or author migrations as reviewed source artifacts, test forward and rollback or forward-fix behavior, and separate destructive changes from compatible application rollout.
7. Prevent injection, unsafe raw queries, mass assignment, tenant-scope bypass, authorization gaps, and sensitive logging; parameterize escape-hatch SQL and keep least-privilege credentials.
8. Test mappings, constraints, migrations, transactions, concurrency, generated queries, failure recovery, and performance against a representative database rather than relying only on mocks.

## Official references

- https://sequelize.org/docs/v6/
- https://www.prisma.io/docs/
- https://typeorm.io/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
