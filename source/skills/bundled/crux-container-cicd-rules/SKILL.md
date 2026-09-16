---
name: crux-container-cicd-rules
description: Container and delivery rules for reproducibility, least privilege, provenance, environment promotion, and safe rollback.
---

# CRUX Containers & CI/CD Rules

## Outcome

Container and delivery rules for reproducibility, least privilege, provenance, environment promotion, and safe rollback.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Build reproducibly from reviewed lockfiles and pinned trusted sources; use multi-stage builds, minimal runtime artifacts, deterministic inputs, and a narrow build context.
2. Keep secrets out of source, arguments, layers, caches, artifacts, logs, and images; use secret mounts or short-lived identity and never bake environment credentials.
3. Run as non-root with minimal capabilities, read-only filesystems where practical, explicit writable paths, resource limits, health checks, and correct signal forwarding.
4. Separate validation, build, scan, attest, package, promote, deploy, verify, and rollback; build once and promote the same immutable artifact.
5. Use least-privilege workflow permissions, pinned third-party actions, protected environments, OIDC short-lived cloud credentials, concurrency controls, and untrusted-input-safe scripts.
6. Do not expose secrets to untrusted pull requests or unsafe self-hosted runners; isolate runners and review artifact, cache, and workflow supply-chain boundaries.
7. Verify final images and deployment manifests with tests, vulnerability and license policy, provenance, smoke checks, observability, rollback readiness, and disaster recovery.

## Official references

- https://docs.docker.com/build/building/best-practices/
- https://docs.github.com/actions/reference/security/secure-use

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
