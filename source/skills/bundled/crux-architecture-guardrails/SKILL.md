---
name: crux-architecture-guardrails
description: Review dependency direction, module boundaries, coupling, and architecture drift.
---

# CRUX Architecture Guardrails

## Outcome

Review dependency direction, module boundaries, coupling, and architecture drift.

## Workflow

1. Identify the repository architecture and its declared dependency boundaries before proposing changes.
2. Keep domain and application logic independent from UI, frameworks, persistence, and transport details.
3. Flag circular dependencies, cross-feature imports, hidden shared state, and abstractions with multiple responsibilities.
4. Prefer the smallest change that preserves existing boundaries; document deliberate boundary changes as an ADR.
5. Report each architectural concern with evidence, impact, and a concrete remediation path.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
