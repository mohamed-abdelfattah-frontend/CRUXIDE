---
name: crux-angular-rules
description: Modern, version-aware Angular rules for standalone APIs, signals, RxJS, DI, templates, and enterprise boundaries.
---

# CRUX Angular Rules

## Outcome

Modern, version-aware Angular rules for standalone APIs, signals, RxJS, DI, templates, and enterprise boundaries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the installed Angular major version and existing standalone or NgModule architecture; do not mix migration styles accidentally.
2. For supported modern Angular code, prefer standalone APIs, route-level lazy loading, functional providers where appropriate, strict templates, and built-in control flow supported by the project.
3. Use signals for owned synchronous UI state and RxJS for asynchronous streams; make signal/observable interop, equality, scheduling, teardown, and error handling explicit.
4. Keep components focused on presentation and interaction; place domain rules, data mapping, orchestration, and side effects behind feature services, facades, or use cases.
5. Use dependency injection deliberately with correct provider scope; avoid root singletons for feature-local mutable state and avoid service-locator access.
6. Keep templates declarative, accessible, track repeated collections, avoid expensive template calls, and use OnPush-compatible immutable flows.
7. Validate routes, guards, resolvers, forms, HTTP boundaries, authorization, error states, hydration or SSR behavior, and production builds with project-native tests.

## Official references

- https://angular.dev/ai/develop-with-ai
- https://angular.dev/guide/signals
- https://angular.dev/reference/migrations/standalone

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
