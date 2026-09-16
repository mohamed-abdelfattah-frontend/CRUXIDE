---
name: crux-python-backend
description: Guide FastAPI, Django, and Python services with explicit contracts, async boundaries, security, persistence, and testing.
---

# CRUX Python Backend

## Outcome

Guide FastAPI, Django, and Python services with explicit contracts, async boundaries, security, persistence, and testing.

## Workflow

1. Detect the framework and repository conventions before changing settings, routing, dependency injection, models, or migrations.
2. Keep handlers and views thin; place business behavior in testable application and domain modules.
3. Validate request and event data, enforce resource authorization, and prevent unsafe serialization or mass assignment.
4. Use async only across truly asynchronous boundaries and avoid blocking the event loop, unbounded workers, or hidden global state.
5. Test API contracts, authorization, database transactions, tasks, migrations, failure paths, and production startup.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
