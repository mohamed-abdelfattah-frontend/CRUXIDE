---
name: crux-express-architecture
description: Build Express services with explicit middleware order, validation, security, and service boundaries.
---

# CRUX Express Architecture

## Outcome

Build Express services with explicit middleware order, validation, security, and service boundaries.

## Workflow

1. Keep routes thin and place validation, authorization, use cases, persistence, and mapping in explicit layers.
2. Define middleware order for request IDs, security headers, parsing, auth, rate limits, routes, and errors.
3. Validate params, query, headers, and body at the boundary and cap payload sizes.
4. Use centralized error mapping, async-safe handlers, structured logs, and graceful shutdown.
5. Test middleware ordering, authorization, validation, error contracts, and shutdown behavior.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
