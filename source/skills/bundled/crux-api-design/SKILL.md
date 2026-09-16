---
name: crux-api-design
description: Design stable REST, GraphQL, gRPC, event, and streaming contracts.
---

# CRUX API Design

## Outcome

Design stable REST, GraphQL, gRPC, event, and streaming contracts.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Start from consumers, domain semantics, authorization, consistency, latency, and evolution requirements.
2. Define identifiers, pagination, filtering, errors, idempotency, concurrency, versioning, and deprecation.
3. Keep transport DTOs separate from persistence and internal domain models.
4. Document authentication, authorization, rate limits, timeouts, retries, and observability fields.
5. Verify contracts with schemas, examples, compatibility tests, and negative cases.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
