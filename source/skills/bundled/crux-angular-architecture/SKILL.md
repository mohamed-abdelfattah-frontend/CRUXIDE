---
name: crux-angular-architecture
description: Guide modern Angular applications using standalone APIs, signals, RxJS, DI, and feature boundaries.
---

# CRUX Angular Architecture

## Outcome

Guide modern Angular applications using standalone APIs, signals, RxJS, DI, and feature boundaries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Prefer standalone components and route-level lazy loading unless the repository intentionally uses NgModules.
2. Use signals for local reactive state and RxJS for asynchronous streams; make interop and teardown explicit.
3. Keep templates declarative, use OnPush-compatible patterns, and avoid subscriptions without lifecycle cleanup.
4. Place HTTP, auth, errors, state, and domain mapping behind injectable services or facades.
5. Test observable behavior, routing, forms, accessibility, and error states.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
