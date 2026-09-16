---
name: crux-java-spring-rules
description: Java and Spring Boot rules for modules, DI, nullability, transactions, persistence, security, testing, and production operations.
---

# CRUX Java & Spring Boot Rules

## Outcome

Java and Spring Boot rules for modules, DI, nullability, transactions, persistence, security, testing, and production operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the JDK, language level, Spring Boot release line, build tool, dependency management, module structure, and supported deployment model before editing.
2. Keep controllers and message adapters thin; define constructor-injected application services and domain boundaries without hiding all behavior behind framework annotations.
3. Use immutable DTOs or records where compatible, explicit validation and null semantics, and stable mapping between transport, domain, and persistence models.
4. Define transaction boundaries at use-case level, avoid accidental lazy loading and N+1 queries, manage migrations explicitly, and understand isolation and locking requirements.
5. Apply Spring Security at method and resource boundaries, validate configuration properties, protect secrets, and return stable errors without stack traces or sensitive detail.
6. Configure Actuator exposure, readiness, liveness, graceful shutdown, structured logging, metrics, traces, timeouts, retries, and connection pools deliberately.
7. Use unit tests for domain logic, focused slices for framework adapters, and integration tests for security, persistence, messaging, migrations, startup, and production packaging.

## Official references

- https://docs.spring.io/spring-boot/reference/
- https://docs.spring.io/spring-boot/reference/actuator/index.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
