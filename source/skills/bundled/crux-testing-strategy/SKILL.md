---
name: crux-testing-strategy
description: Select proportionate unit, integration, contract, component, and end-to-end testing.
---

# CRUX Testing Strategy

## Outcome

Select proportionate unit, integration, contract, component, and end-to-end testing.

## Workflow

1. Map changed behavior and failure modes to the cheapest test layer that can prove them reliably.
2. Require regression coverage for bug fixes and contract coverage at service boundaries.
3. Avoid tests coupled to implementation details, generated wording, timing, or incidental markup.
4. Include negative, authorization, cancellation, concurrency, accessibility, and recovery cases when relevant.
5. Never claim a check passed unless it was executed; state skipped checks and residual risk.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
