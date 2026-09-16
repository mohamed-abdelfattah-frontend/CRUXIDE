---
name: crux-performance-rules
description: Optional rules that require measurement before and after performance changes.
---

# CRUX Performance Rules

## Outcome

Optional rules that require measurement before and after performance changes.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define the affected metric and capture a reproducible baseline.
2. Do not trade away correctness, accessibility, security, or maintainability for unmeasured speed.
3. Avoid unbounded collections, retries, concurrency, polling, payloads, and rendering work.
4. Keep caching behavior, invalidation, and stale-data semantics explicit.
5. Record the measurement method and observed result after optimization.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
