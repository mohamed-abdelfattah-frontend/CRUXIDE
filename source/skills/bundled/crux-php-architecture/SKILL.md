---
name: crux-php-architecture
description: Guide typed, secure, testable PHP services with explicit domain, application, infrastructure, and delivery boundaries.
---

# CRUX PHP Architecture

## Outcome

Guide typed, secure, testable PHP services with explicit domain, application, infrastructure, and delivery boundaries.

## Workflow

1. Use the PHP version, dependency manager, coding standard, and static-analysis baseline declared by the repository.
2. Keep controllers, commands, jobs, and transport adapters thin; place business behavior behind explicit application and domain boundaries.
3. Use strict types where the project supports them and validate all external input before it reaches domain logic.
4. Keep database transactions, queues, caches, files, mail, and third-party calls behind testable interfaces with explicit failure behavior.
5. Verify behavior with the project test runner, static analysis, formatting, and representative production configuration.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
