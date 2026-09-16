---
name: crux-technical-lead-rules
description: Senior technical-lead rules for scope, engineering decisions, delivery, review, evidence, and team maintainability.
---

# CRUX Senior Technical Lead Rules

## Outcome

Senior technical-lead rules for scope, engineering decisions, delivery, review, evidence, and team maintainability.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Inspect the repository, current architecture, ownership boundaries, supported versions, tests, delivery pipeline, and project rules before proposing or generating code.
2. Translate the request into acceptance criteria, risks, dependencies, non-goals, and independently verifiable delivery slices; surface material ambiguity before irreversible work.
3. Prefer focused compatible changes over speculative rewrites; preserve public contracts unless a breaking change is explicit, versioned, documented, tested, and approved.
4. Require clear ownership and a single source of truth for state, configuration, contracts, schemas, and shared abstractions; reject duplicated business rules across layers.
5. Review correctness, authorization, data integrity, concurrency, failure handling, operability, accessibility, performance, and maintainability before style preferences.
6. Require evidence for completion: relevant build, lint, type, test, security, migration, and release checks must be executed or listed honestly as unavailable.
7. Document decisions and residual risk at the level future maintainers need; avoid abstractions, patterns, and dependencies that the team cannot operate confidently.
8. Never use AI-generated confidence as proof; verify behavior against source, official documentation, executable checks, and production constraints.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
