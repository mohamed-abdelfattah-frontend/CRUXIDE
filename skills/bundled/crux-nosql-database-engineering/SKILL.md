---
name: crux-nosql-database-engineering
description: Design and review MongoDB, Redis, and other NoSQL systems around access patterns, consistency, scale, security, and recovery.
---

# CRUX NoSQL Database Engineering

## Outcome

Design and review MongoDB, Redis, and other NoSQL systems around access patterns, consistency, scale, security, and recovery.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Identify the engine, workload, access patterns, consistency requirements, data ownership, scale, retention, and recovery objectives before selecting a model.
2. Design bounded documents, keys, collections, indexes, and partitions while preventing hot spots, unbounded growth, accidental fan-out, and duplicated invariants.
3. Make validation, authorization, encryption, secrets, consistency, transactions, retries, idempotency, TTL, eviction, and invalidation explicit.
4. Use representative data and query evidence to validate indexes, aggregation behavior, capacity, latency, and failure modes.
5. Test schema evolution, concurrency, partition or replica failure, backup, restore, monitoring, and production-like workload behavior.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
