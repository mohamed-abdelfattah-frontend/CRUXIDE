---
name: crux-react-native-rules
description: React Native and Expo rules for native boundaries, navigation, security, offline behavior, accessibility, and device performance.
---

# CRUX React Native & Expo Rules

## Outcome

React Native and Expo rules for native boundaries, navigation, security, offline behavior, accessibility, and device performance.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect React Native, Expo SDK, architecture mode, navigation, native-module, and supported platform versions before changing native boundaries.
2. Keep screens, UI components, domain behavior, data access, navigation, and native adapters separated; shared code must not hide platform-specific requirements.
3. Model permissions, deep links, app links, secure storage, push notifications, background work, app lifecycle, offline sync, and session expiry explicitly.
4. Never embed secrets in the application bundle; minimize exported Android components, iOS entitlements, permissions, sensitive logs, and screen-capture exposure.
5. Keep list rendering, images, animation, bridge or JSI calls, startup work, memory, battery, and network usage bounded and measured on representative devices.
6. Support safe areas, keyboard, gestures, dynamic text, screen readers, RTL, reduced motion, and platform interaction conventions.
7. Test business logic, navigation, native integrations, permission denial, interruption, offline recovery, upgrades, release builds, and real-device critical paths.

## Official references

- https://reactnative.dev/docs/performance
- https://docs.expo.dev/guides/security/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
