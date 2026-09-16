---
name: crux-solution-architecture-rules
description: Senior solution-architecture rules for quality attributes, boundaries, integration, data, resilience, security, and operability.
---

# CRUX Solution Architecture Rules

## Outcome

Senior solution-architecture rules for quality attributes, boundaries, integration, data, resilience, security, and operability.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Clarify business outcome, actors, functional scope, constraints, quality attributes, scale assumptions, data classification, compliance, budget, and operational ownership before selecting architecture.
2. Define system context, trust boundaries, deployable units, dependency direction, synchronous and asynchronous flows, data ownership, and failure domains before implementation.
3. Choose the simplest architecture that satisfies measured requirements; do not introduce microservices, events, distributed state, CQRS, or new infrastructure without a concrete need and ownership model.
4. Record consequential choices as ADRs with considered alternatives, trade-offs, reversibility, migration path, and measurable decision criteria.
5. Design authentication, resource authorization, secrets, privacy, retention, audit, threat mitigations, and supply-chain controls as architecture concerns rather than final-stage checks.
6. Define timeouts, retries, idempotency, backpressure, graceful degradation, recovery objectives, observability, capacity signals, and runbooks for every remote or stateful boundary.
7. Plan compatible rollout, data migration, feature flags, rollback, deprecation, and disaster recovery before approving a breaking or irreversible change.
8. Trace every proposed component to a requirement or quality attribute and identify assumptions, unresolved risks, owners, and validation evidence.

## Official references

- https://learn.microsoft.com/en-us/azure/architecture/framework/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
