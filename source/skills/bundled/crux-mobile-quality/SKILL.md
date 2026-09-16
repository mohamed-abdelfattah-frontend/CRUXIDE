---
name: crux-mobile-quality
description: Review cross-platform mobile apps for accessibility, offline resilience, security, and device performance.
---

# CRUX Mobile Quality

## Outcome

Review cross-platform mobile apps for accessibility, offline resilience, security, and device performance.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Exercise startup, background/foreground, interruption, offline, slow-network, and session-expiry behavior.
2. Audit secrets, logs, storage, permissions, deep links, network trust, and sensitive screenshots.
3. Measure startup, memory, rendering, battery, network, and binary-size impact.
4. Validate accessibility, localization, RTL, dynamic text, gestures, and device form factors.
5. Record platform-specific findings separately from shared business logic concerns.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
