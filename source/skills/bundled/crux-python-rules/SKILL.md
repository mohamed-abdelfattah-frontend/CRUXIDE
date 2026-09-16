---
name: crux-python-rules
description: Python rules for supported interpreters, typing, environments, async behavior, security, packaging, and production testing.
---

# CRUX Python Rules

## Outcome

Python rules for supported interpreters, typing, environments, async behavior, security, packaging, and production testing.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Python constraint, environment and package manager, lockfile, framework, type checker, linter, test runner, and deployment runtime before editing.
2. Use type annotations at public and trust boundaries, precise models instead of unstructured dictionaries, and explicit Optional and error semantics; avoid broad Any escapes.
3. Keep import-time side effects, mutable module globals, dynamic execution, unsafe deserialization, and hidden environment reads out of reusable application logic.
4. Use async only for asynchronous I/O, avoid blocking the event loop, own tasks, propagate cancellation, bound concurrency, and clean up clients, files, pools, and subprocesses.
5. Validate untrusted data, parameterize queries, use safe parsers, protect secrets, constrain file paths and subprocess arguments, and redact sensitive logs.
6. Keep notebooks exploratory; move reusable production behavior into importable typed modules with reproducible dependencies, datasets, seeds, and configuration.
7. Run formatter and Ruff or project linter, type checker, unit and integration tests, security and dependency checks when configured, migration tests, and production startup.

## Official references

- https://docs.python.org/3/library/typing.html
- https://docs.python.org/3/library/asyncio-dev.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
