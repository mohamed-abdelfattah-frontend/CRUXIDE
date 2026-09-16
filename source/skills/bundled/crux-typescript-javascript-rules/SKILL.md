---
name: crux-typescript-javascript-rules
description: Version-aware TypeScript and JavaScript rules for strict contracts, modules, async behavior, and safe runtime boundaries.
---

# CRUX TypeScript & JavaScript Rules

## Outcome

Version-aware TypeScript and JavaScript rules for strict contracts, modules, async behavior, and safe runtime boundaries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Read package manifests, lockfiles, tsconfig, module type, runtime targets, and lint configuration before selecting syntax, module format, or compiler behavior.
2. Keep strict type checking enabled where the repository supports it; do not introduce any, unsafe assertions, non-null assertions, or broad index signatures without a documented boundary reason.
3. Treat data from JSON, storage, environment, network, messages, and third-party libraries as unknown until runtime validation narrows it.
4. Model invalid states out of public contracts with discriminated unions, explicit nullability, readonly data, and exhaustive handling where practical.
5. Preserve ESM/CommonJS and browser/runtime compatibility; do not mix import conventions or change module resolution incidentally.
6. Await or intentionally supervise every promise, propagate cancellation when available, and handle rejection, cleanup, concurrency limits, and timeout behavior explicitly.
7. Avoid hidden mutation, prototype pollution paths, eval-like execution, unsafe object merging, and precision-sensitive number handling without validation.
8. Run the repository formatter, linter, typecheck, unit tests, and production build for affected packages before completion.

## Official references

- https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
