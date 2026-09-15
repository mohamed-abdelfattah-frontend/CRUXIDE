---
name: crux-nestjs-architecture
description: Guide NestJS modules, dependency injection, guards, pipes, interceptors, persistence, and distributed patterns.
---

# CRUX NestJS Architecture

## Outcome

Guide NestJS modules, dependency injection, guards, pipes, interceptors, persistence, and distributed patterns.

## Workflow

1. Design modules around business capabilities and avoid a global shared module that owns unrelated concerns.
2. Keep controllers and transport adapters thin; place use cases and domain rules outside framework decorators.
3. Use guards for authorization, pipes for validation/transformation, and interceptors for cross-cutting behavior.
4. Make transaction, event, queue, cache, and external-service boundaries explicit.
5. Test providers, module wiring, transport contracts, authorization, and failure recovery.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
