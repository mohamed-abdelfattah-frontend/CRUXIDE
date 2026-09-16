---
name: crux-database-engineering
description: Design and review relational data models, queries, migrations, indexing, security, and operational safety.
---

# CRUX Database Engineering

## Outcome

Design and review relational data models, queries, migrations, indexing, security, and operational safety.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Derive schema and consistency requirements from domain invariants, access patterns, scale, retention, and recovery objectives.
2. Use parameterized queries, least-privilege identities, encrypted connections, and protected secrets.
3. Review query plans and representative data before adding indexes or denormalizing; measure write and storage trade-offs.
4. Make migrations backward compatible where rolling deployment requires it and define backup, rollback, and data-validation steps.
5. Test constraints, transactions, concurrency, time zones, pagination, failure recovery, and production-like query behavior.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
