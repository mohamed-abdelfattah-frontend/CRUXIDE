---
name: crux-react-rules
description: Modern React rules for pure rendering, hooks, state ownership, effects, boundaries, accessibility, and measured performance.
---

# CRUX React Rules

## Outcome

Modern React rules for pure rendering, hooks, state ownership, effects, boundaries, accessibility, and measured performance.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the React version, renderer, router, framework, compiler support, and established state and testing libraries before choosing APIs.
2. Keep components and hooks pure, call hooks only at the top level, and never mutate props, state, hook arguments, or values created outside render.
3. Separate server state, URL state, form state, local UI state, and shared client state; place each state at the narrowest stable owner.
4. Use effects only to synchronize with external systems; derive render data directly and handle dependencies, cancellation, cleanup, stale responses, and Strict Mode behavior.
5. Prefer composition and explicit data flow over inheritance, broad contexts, prop mirroring, imperative refs, or premature global stores.
6. Place loading, Suspense, error, retry, empty, unauthorized, and offline boundaries where the user can recover without losing unrelated state.
7. Measure before memoizing; test user-observable behavior, accessibility, state transitions, error recovery, and production builds rather than implementation details.

## Official references

- https://react.dev/reference/rules
- https://react.dev/learn/you-might-not-need-an-effect

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
