---
name: crux-express-rules
description: Express rules for middleware order, boundary validation, secure HTTP behavior, errors, sessions, and graceful operations.
---

# CRUX Express Rules

## Outcome

Express rules for middleware order, boundary validation, secure HTTP behavior, errors, sessions, and graceful operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Express major version and existing middleware stack; do not copy APIs or routing behavior across incompatible releases.
2. Define middleware order explicitly for trust proxy, request IDs, security headers, body limits, CORS, authentication, rate limits, routes, 404s, and errors.
3. Validate params, query, headers, cookies, files, redirects, and bodies; cap depth and size and authorize access to the concrete resource.
4. Keep route handlers thin and use centralized async-safe error mapping with no stack traces, secrets, framework fingerprints, or unstable internal details in responses.
5. Use TLS at the trusted edge, secure cookie attributes, a production session store, CSRF protection where cookies authenticate requests, and allowlisted redirects and origins.
6. Implement readiness, liveness, SIGTERM draining, connection and dependency cleanup, request deadlines, structured logs, and correlation IDs.
7. Test middleware ordering, validation, authorization, rate limiting, sessions, errors, payload limits, health checks, and graceful shutdown.

## Official references

- https://expressjs.com/en/advanced/best-practice-security/
- https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
