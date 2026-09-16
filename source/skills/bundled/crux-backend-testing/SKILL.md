---
name: crux-backend-testing
description: Build proportionate backend test suites across domain, services, databases, queues, and APIs.
---

# CRUX Backend Testing

## Outcome

Build proportionate backend test suites across domain, services, databases, queues, and APIs.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Keep domain tests fast and deterministic, then add integration tests where infrastructure behavior matters.
2. Use contract tests for public APIs, events, and third-party integrations.
3. Exercise authorization, validation, transactions, concurrency, idempotency, retries, and partial failure.
4. Use representative databases or containers only where fakes cannot prove the behavior.
5. Make fixtures isolated, explicit, and free of real credentials or production data.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
