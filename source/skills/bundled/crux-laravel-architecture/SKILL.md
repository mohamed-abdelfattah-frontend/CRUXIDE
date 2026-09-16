---
name: crux-laravel-architecture
description: Build maintainable Laravel systems with thin delivery layers, explicit authorization, queues, events, and data boundaries.
---

# CRUX Laravel Architecture

## Outcome

Build maintainable Laravel systems with thin delivery layers, explicit authorization, queues, events, and data boundaries.

## Workflow

1. Use supported Laravel conventions without placing unrelated business logic in controllers, models, service providers, or facades.
2. Validate requests at the boundary and enforce policies or gates against the concrete resource being accessed.
3. Make Eloquent loading, transactions, pagination, mass assignment, casts, observers, and soft-delete behavior explicit.
4. Design jobs, events, listeners, retries, uniqueness, idempotency, and failed-job recovery for at-least-once delivery.
5. Test HTTP contracts, authorization, database behavior, queues, events, notifications, and production configuration.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
