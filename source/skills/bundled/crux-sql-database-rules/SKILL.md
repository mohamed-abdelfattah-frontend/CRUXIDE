---
name: crux-sql-database-rules
description: Database rules for schema invariants, safe SQL, transactions, migrations, indexing, authorization, resilience, and operations.
---

# CRUX SQL & Database Rules

## Outcome

Database rules for schema invariants, safe SQL, transactions, migrations, indexing, authorization, resilience, and operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Derive schema, keys, nullability, constraints, ownership, retention, tenancy, access patterns, scale, and recovery objectives from domain invariants before implementation.
2. Use parameterized queries and least-privilege identities; never concatenate untrusted SQL, expose broad database credentials, or rely on application filtering for data authorization alone.
3. Select transaction boundaries and isolation from consistency requirements; handle retries, deadlocks, lost updates, idempotency, and optimistic or pessimistic concurrency explicitly.
4. Review representative query plans and data distribution before adding indexes or denormalizing; measure read benefit against write, storage, locking, and maintenance cost.
5. Make migrations backward compatible for rolling releases, split destructive changes, preserve data, test at production-like scale, and define verification and rollback or forward-fix strategy.
6. Bound result sets with stable pagination, avoid N+1 access and accidental full scans, manage time zones and money precisely, and specify deletion and archival semantics.
7. Monitor latency, errors, locks, saturation, replication, storage, backup, restore, and schema drift; test constraints, concurrency, migrations, restore, and failover behavior.

## Official references

- https://www.postgresql.org/docs/current/sql.html
- https://www.postgresql.org/docs/current/ddl-rowsecurity.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
