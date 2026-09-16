---
name: crux-api-rules
description: Optional API contract rules for validation, authorization, errors, idempotency, and evolution.
---

# CRUX API Rules

## Outcome

Optional API contract rules for validation, authorization, errors, idempotency, and evolution.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Validate every external input and authorize access to the concrete resource, not only the route.
2. Return stable documented error contracts without internal stack traces or secret detail.
3. Define pagination, filtering, limits, timeouts, retries, concurrency, and idempotency where relevant.
4. Version breaking changes and preserve compatibility intentionally.
5. Add schema or contract tests for public API and event changes.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
