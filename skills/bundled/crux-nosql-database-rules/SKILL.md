---
name: crux-nosql-database-rules
description: NoSQL rules for document, key-value, cache, consistency, indexing, partitioning, security, and operational safety.
---

# CRUX NoSQL Database Rules

## Outcome

NoSQL rules for document, key-value, cache, consistency, indexing, partitioning, security, and operational safety.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the database engine and version, deployment topology, driver, consistency model, indexing strategy, partitioning, retention, and recovery requirements before changing data behavior.
2. Choose a NoSQL model from demonstrated access patterns, scale, latency, availability, and consistency needs; document the trade-offs against a relational design instead of selecting it by convenience.
3. Design bounded documents, keys, collections, and partitions with explicit ownership; prevent unbounded arrays, oversized documents, hot keys, hot partitions, accidental fan-out, and duplicated invariants.
4. Enforce schema validation where supported, resource authorization, least-privilege identities, encrypted connections, protected secrets, and defenses against query or operator injection.
5. Define read and write consistency, transactions, concurrency control, idempotency, retry behavior, and conflict resolution explicitly for every correctness-sensitive workflow.
6. Build indexes from representative queries and data distribution, inspect execution evidence, and measure read benefit against write amplification, memory, storage, and maintenance cost.
7. Treat Redis and other caches as correctness-sensitive derived state with explicit TTL, eviction, invalidation, stampede protection, durability assumptions, and degraded-mode behavior.
8. Version schema evolution and backfills, preserve compatibility during rollout, and test validation, indexes, concurrency, partition failure, backup, restore, monitoring, and production-like load.

## Official references

- https://www.mongodb.com/docs/manual/data-modeling/
- https://www.mongodb.com/docs/manual/core/transactions/
- https://redis.io/docs/latest/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
