---
name: crux-go-rules
description: Go rules for simple packages, context cancellation, concurrency ownership, errors, resources, testing, and production services.
---

# CRUX Go Rules

## Outcome

Go rules for simple packages, context cancellation, concurrency ownership, errors, resources, testing, and production services.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Go version, module or workspace structure, build tags, generated code, linter policy, and deployment targets before selecting APIs.
2. Keep packages cohesive with small consumer-owned interfaces; avoid cyclic dependencies, generic abstraction without repeated need, and global mutable state.
3. Pass context explicitly across request-scoped boundaries, honor cancellation and deadlines, never store contexts, and do not use context values for ordinary parameters.
4. Give every goroutine an owner and termination path; bound concurrency, channels, queues, retries, and buffers and prevent leaks, races, deadlocks, and blocked sends.
5. Wrap errors with useful context while preserving errors.Is or errors.As behavior; avoid string matching and do not log the same failure at every layer.
6. Close resources deterministically, validate configuration at startup, use structured logs, metrics, traces, health checks, and graceful server shutdown.
7. Run gofmt, vet, configured lint, unit and integration tests, fuzz tests for parsers or boundaries, the race detector where practical, and release builds.

## Official references

- https://go.dev/doc/effective_go
- https://go.dev/doc/security/fuzz/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
