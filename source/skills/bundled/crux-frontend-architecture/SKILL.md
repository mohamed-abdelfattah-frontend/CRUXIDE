---
name: crux-frontend-architecture
description: Structure enterprise frontends around feature boundaries, predictable data flow, and reusable platform services.
---

# CRUX Frontend Architecture

## Outcome

Structure enterprise frontends around feature boundaries, predictable data flow, and reusable platform services.

## Workflow

1. Identify route, feature, domain, UI, data-access, state, and platform boundaries before changing structure.
2. Keep business rules outside presentation components and prevent features from importing one another implicitly.
3. Centralize cross-cutting network, auth, error, observability, i18n, and security behavior.
4. Design loading, empty, error, offline, unauthorized, and partial-success states explicitly.
5. Preserve accessibility, responsive behavior, performance budgets, and testability.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
