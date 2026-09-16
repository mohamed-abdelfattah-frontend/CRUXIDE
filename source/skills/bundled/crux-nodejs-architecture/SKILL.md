---
name: crux-nodejs-architecture
description: Design production Node.js services around bounded concurrency, errors, observability, and graceful lifecycle.
---

# CRUX Node.js Architecture

## Outcome

Design production Node.js services around bounded concurrency, errors, observability, and graceful lifecycle.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Keep request orchestration, domain logic, persistence, integrations, and runtime concerns separated.
2. Bound concurrency, timeouts, retries, queues, streams, and memory use; propagate cancellation where possible.
3. Normalize operational and programmer errors without leaking sensitive detail.
4. Implement structured logs, metrics, traces, health/readiness, and graceful shutdown.
5. Test failure modes, resource cleanup, concurrency, contracts, and production startup.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
