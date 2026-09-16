---
name: crux-java-spring-architecture
description: Guide Spring Boot services across modules, dependency injection, persistence, transactions, security, and operations.
---

# CRUX Java & Spring Boot

## Outcome

Guide Spring Boot services across modules, dependency injection, persistence, transactions, security, and operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Respect the repository JDK, build tool, Spring Boot version, formatter, static analysis, and module boundaries.
2. Keep controllers and messaging adapters thin; isolate use cases and domain behavior from Spring and persistence implementation details.
3. Make bean scope, configuration properties, validation, transaction boundaries, lazy loading, and migration ownership explicit.
4. Apply Spring Security at method and resource boundaries and return stable error contracts without leaking internal detail.
5. Test slices deliberately, use integration tests for real framework boundaries, and verify startup, health, shutdown, and production packaging.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
