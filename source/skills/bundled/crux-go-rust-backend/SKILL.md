---
name: crux-go-rust-backend
description: Guide production Go and Rust services with explicit ownership, cancellation, concurrency, errors, and operational boundaries.
---

# CRUX Go & Rust Backend

## Outcome

Guide production Go and Rust services with explicit ownership, cancellation, concurrency, errors, and operational boundaries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Follow the selected language toolchain, module or workspace layout, formatter, linter, and dependency policy.
2. Keep transport, domain, persistence, and external integrations separated without hiding simple behavior behind unnecessary abstractions.
3. Bound goroutines, tasks, channels, locks, queues, retries, timeouts, and memory; propagate cancellation and ownership explicitly.
4. Use typed errors and stable public contracts while preserving useful internal context and avoiding secret leakage.
5. Test concurrency, cancellation, failure recovery, API contracts, data races or unsafe boundaries, and release builds.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
