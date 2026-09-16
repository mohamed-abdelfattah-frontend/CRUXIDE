---
name: crux-react-native-architecture
description: Structure React Native apps for navigation, native boundaries, offline behavior, security, and performance.
---

# CRUX React Native Architecture

## Outcome

Structure React Native apps for navigation, native boundaries, offline behavior, security, and performance.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Separate screens, features, domain logic, data access, navigation, and native integrations.
2. Design permissions, deep links, secure storage, app lifecycle, offline sync, and recovery explicitly.
3. Keep expensive rendering and bridge interactions measured and bounded.
4. Handle accessibility, dynamic text, safe areas, keyboard, gestures, and platform differences.
5. Test business logic, navigation flows, native integrations, and representative devices.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
