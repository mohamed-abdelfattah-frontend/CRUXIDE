---
name: crux-nestjs-rules
description: NestJS rules for business modules, DI, request lifecycle, validation, authorization, transports, and operations.
---

# CRUX NestJS Rules

## Outcome

NestJS rules for business modules, DI, request lifecycle, validation, authorization, transports, and operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect NestJS, platform adapter, transport, validation, ORM, and module conventions before changing framework composition.
2. Organize modules around business capabilities, keep controllers and gateways thin, export the minimum surface, and avoid unrelated global shared modules.
3. Use guards for authentication and authorization, pipes for validation and transformation, interceptors for cross-cutting behavior, and filters for stable error mapping.
4. Validate environment configuration at bootstrap and keep provider scopes explicit; prevent request-scoped dependencies from leaking into singleton or background work.
5. Make transaction, cache, queue, event, retry, idempotency, and external-service boundaries explicit and observable.
6. Enable shutdown hooks where required and close servers, consumers, pools, and telemetry cleanly; expose meaningful readiness and liveness.
7. Test providers, module wiring, request lifecycle ordering, authorization, validation, transport contracts, background processing, startup, and shutdown.

## Official references

- https://docs.nestjs.com/faq/request-lifecycle
- https://docs.nestjs.com/fundamentals/lifecycle-events

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
