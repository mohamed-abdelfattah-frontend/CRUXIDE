---
name: crux-flutter-architecture
description: Guide Flutter projects with feature boundaries, explicit state, navigation, testing, and platform integration.
---

# CRUX Flutter Architecture

## Outcome

Guide Flutter projects with feature boundaries, explicit state, navigation, testing, and platform integration.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Separate presentation, application, domain, and infrastructure concerns without unnecessary boilerplate.
2. Choose state management based on lifecycle and ownership, and keep side effects outside widgets.
3. Model navigation, deep links, offline state, errors, permissions, and secure storage explicitly.
4. Use const widgets, bounded rebuilds, responsive layout, semantics, and localization.
5. Test domain behavior, widgets, integrations, and release builds on supported platforms.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
