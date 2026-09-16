---
name: crux-php-rules
description: Supported-PHP rules for types, Composer, boundaries, security, errors, static analysis, and production behavior.
---

# CRUX PHP Rules

## Outcome

Supported-PHP rules for types, Composer, boundaries, security, errors, static analysis, and production behavior.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Read composer.json, composer.lock, platform constraints, supported PHP branch, extensions, coding standard, and static-analysis baseline before editing.
2. Use strict types where compatible, typed properties and signatures, immutable value objects where useful, and explicit null and error semantics.
3. Validate external input, parameterize data access, escape output by context, prevent unsafe deserialization, and keep secrets and sensitive errors out of responses and logs.
4. Keep controllers, commands, jobs, and templates thin; place business behavior in explicit application and domain services with testable boundaries.
5. Manage resources, transactions, files, streams, time zones, money, and encoding explicitly; do not rely on mutable global or request state.
6. Preserve Composer lock integrity, review plugins and scripts, avoid unsupported PHP branches and pre-release runtimes in production, and document upgrade constraints.
7. Run formatting, static analysis, tests, dependency audit, representative configuration, and production autoloader checks.

## Official references

- https://www.php.net/supported-versions.php
- https://www.php.net/manual/en/security.php

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
