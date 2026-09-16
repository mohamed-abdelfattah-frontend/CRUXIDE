---
name: crux-nodejs-rules
description: Node.js runtime rules for event-loop safety, async ownership, lifecycle, security, observability, and production reliability.
---

# CRUX Node.js Rules

## Outcome

Node.js runtime rules for event-loop safety, async ownership, lifecycle, security, observability, and production reliability.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Node.js release line, package manager, module format, runtime flags, lockfile, and deployment model before changing runtime behavior.
2. Keep CPU-heavy or blocking work off request paths and the event loop; bound workers, queues, streams, buffers, concurrency, and memory.
3. Await or supervise every async operation, propagate AbortSignal where supported, define timeouts, clean up resources, and reject unhandled promise failures.
4. Validate configuration at startup and external data at boundaries; avoid eval-like execution, prototype-pollution paths, unsafe shell interpolation, and leaked secrets.
5. Use explicit error classes and stable public error contracts while preserving internal causes, correlation, and redacted structured logs.
6. Implement readiness, liveness, metrics, traces, graceful SIGTERM shutdown, connection draining, and cleanup for servers, pools, consumers, and jobs.
7. Test failure paths, cancellation, stream backpressure, concurrency, resource cleanup, production startup, shutdown, and supported runtime versions.

## Official references

- https://nodejs.org/api/process.html
- https://nodejs.org/api/test.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
