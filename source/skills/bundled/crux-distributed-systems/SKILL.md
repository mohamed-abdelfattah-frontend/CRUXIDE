---
name: crux-distributed-systems
description: Reason about consistency, queues, retries, caching, idempotency, and service failure.
---

# CRUX Distributed Systems

## Outcome

Reason about consistency, queues, retries, caching, idempotency, and service failure.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define ownership, consistency requirements, message contracts, ordering, duplication, and failure semantics.
2. Use idempotency keys, bounded retries with jitter, dead-letter handling, and observable correlation IDs.
3. Treat caches as derived state with explicit invalidation and stale-data behavior.
4. Avoid distributed transactions when compensating workflows or clearer ownership can solve the problem.
5. Test duplicates, reordering, timeouts, partitions, recovery, and replay.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
