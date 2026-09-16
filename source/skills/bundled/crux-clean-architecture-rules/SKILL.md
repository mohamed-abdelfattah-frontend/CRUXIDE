---
name: crux-clean-architecture-rules
description: Optional dependency-direction and boundary rules for layered or feature-oriented systems.
---

# CRUX Clean Architecture Rules

## Outcome

Optional dependency-direction and boundary rules for layered or feature-oriented systems.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Domain rules must not depend on UI, transport, persistence, or vendor frameworks.
2. Application use cases coordinate domain behavior through explicit ports.
3. Infrastructure implements ports and remains replaceable from core logic.
4. Features must not reach into another feature internal implementation.
5. Any deliberate boundary exception should be narrow, documented, and reviewable.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
