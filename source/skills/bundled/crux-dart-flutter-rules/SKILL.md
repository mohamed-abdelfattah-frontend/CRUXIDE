---
name: crux-dart-flutter-rules
description: Dart and Flutter rules for layered architecture, state, navigation, rendering, accessibility, and multi-platform delivery.
---

# CRUX Dart & Flutter Rules

## Outcome

Dart and Flutter rules for layered architecture, state, navigation, rendering, accessibility, and multi-platform delivery.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect Dart and Flutter SDK constraints, target platforms, state management, routing, generated code, and package conventions before editing.
2. Separate views, view models or controllers, domain use cases, repositories, and services with explicit dependencies and a single owner for mutable state.
3. Keep side effects outside widget build methods, dispose owned resources, handle async cancellation and stale results, and make errors and retries explicit.
4. Use const and immutable widgets where valid, stable keys for identity, bounded rebuild scopes, lazy collections, and measured rendering or startup optimizations.
5. Model navigation, deep links, permissions, secure storage, offline synchronization, background work, restoration, and platform-channel failures explicitly.
6. Support semantics, keyboard, focus, dynamic text, localization, RTL, adaptive layouts, reduced motion, and each target platform convention.
7. Run analyzer, formatter, unit, widget, golden where stable, integration, migration, and release-build checks on the supported targets.

## Official references

- https://docs.flutter.dev/app-architecture/recommendations
- https://docs.flutter.dev/testing/overview

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
