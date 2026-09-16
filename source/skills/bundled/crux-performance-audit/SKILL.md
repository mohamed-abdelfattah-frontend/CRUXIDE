---
name: crux-performance-audit
description: Find measurable frontend, backend, mobile, database, and delivery performance bottlenecks.
---

# CRUX Performance Audit

## Outcome

Find measurable frontend, backend, mobile, database, and delivery performance bottlenecks.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define the user-visible or system metric first and capture a baseline before recommending optimization.
2. Trace cost across network, compute, rendering, storage, caching, concurrency, and bundle boundaries.
3. Prioritize high-impact bottlenecks over speculative micro-optimizations.
4. Preserve correctness, accessibility, security, and observability while optimizing.
5. Provide a repeatable measurement plan and compare results against the baseline.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
