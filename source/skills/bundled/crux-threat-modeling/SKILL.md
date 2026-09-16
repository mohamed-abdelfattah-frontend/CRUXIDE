---
name: crux-threat-modeling
description: Build practical threat models tied to concrete system components and mitigations.
---

# CRUX Threat Modeling

## Outcome

Build practical threat models tied to concrete system components and mitigations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Inventory assets, actors, privileges, entry points, trust boundaries, and sensitive data flows.
2. Model abuse cases and threats against authentication, authorization, integrity, confidentiality, and availability.
3. Rank risks by likelihood, impact, exposure, and existing controls rather than by category alone.
4. Tie mitigations to owners, verification steps, and residual risk.
5. Update the model when architecture, permissions, integrations, or data classifications change.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
