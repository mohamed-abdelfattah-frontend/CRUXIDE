---
name: crux-laravel-rules
description: Laravel rules for validation, resource authorization, Eloquent, queues, transactions, configuration, and production testing.
---

# CRUX Laravel Rules

## Outcome

Laravel rules for validation, resource authorization, Eloquent, queues, transactions, configuration, and production testing.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Laravel and PHP versions, application structure, auth stack, queue, cache, database, and testing conventions before changing framework behavior.
2. Keep controllers, console commands, jobs, listeners, models, and service providers focused; place multi-step business behavior in explicit actions or application services.
3. Use Form Requests or equivalent boundary validation and Policies or Gates for resource authorization; never rely on hidden buttons or route access alone.
4. Control mass assignment, casts, serialization, eager loading, pagination, transactions, locking, soft deletes, observers, and tenant scoping explicitly.
5. Design queued work for at-least-once delivery with idempotency, unique constraints where appropriate, retries, backoff, timeouts, failed-job handling, and transaction-aware dispatch.
6. Cache configuration in production, keep env access in configuration, protect application keys and secrets, and avoid leaking debug output or Telescope data.
7. Test HTTP contracts, authorization, validation, database constraints, migrations, queues, events, notifications, schedules, and production configuration.

## Official references

- https://laravel.com/docs/authorization
- https://laravel.com/docs/queues

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
