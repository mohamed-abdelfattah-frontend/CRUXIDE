---
name: crux-cicd
description: Design secure CI/CD pipelines with quality gates, environments, provenance, and rollback.
---

# CRUX CI/CD

## Outcome

Design secure CI/CD pipelines with quality gates, environments, provenance, and rollback.

## Workflow

1. Use least-privilege short-lived credentials and pin third-party actions or dependencies.
2. Separate validation, build, security, packaging, promotion, deployment, and rollback concerns.
3. Build once and promote the same verified artifact across environments.
4. Protect production with approvals, concurrency controls, environment rules, and observable deployment status.
5. Make failures actionable and keep secrets and untrusted input out of shell interpolation.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
