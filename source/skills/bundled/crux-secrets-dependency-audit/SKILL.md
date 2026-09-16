---
name: crux-secrets-dependency-audit
description: Review repositories for exposed secrets, risky packages, lockfile drift, and unsafe dependency practices.
---

# CRUX Secrets & Dependency Audit

## Outcome

Review repositories for exposed secrets, risky packages, lockfile drift, and unsafe dependency practices.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Inspect manifests, lockfiles, registries, install scripts, CI configuration, and secret-handling patterns.
2. Distinguish a package name match from a confirmed vulnerability and cite the affected version range.
3. Prefer pinned, provenance-verifiable dependencies and preserve lockfile integrity.
4. Do not print secret values; report only the location, secret class, and rotation action.
5. Recommend upgrades with compatibility, rollback, and verification steps.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
