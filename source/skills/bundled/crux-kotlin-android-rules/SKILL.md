---
name: crux-kotlin-android-rules
description: Kotlin, coroutines, Android, and Compose rules for lifecycle-aware state, modular architecture, security, and quality.
---

# CRUX Kotlin & Android Rules

## Outcome

Kotlin, coroutines, Android, and Compose rules for lifecycle-aware state, modular architecture, security, and quality.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect Kotlin, Android Gradle Plugin, Compose compiler, min/target SDK, and supported device constraints before selecting APIs.
2. Keep UI, ViewModel or state holder, use cases, repositories, data sources, and platform services separated with unidirectional data flow and immutable UI state.
3. Use structured concurrency with owned scopes, cancellation, explicit dispatchers at blocking boundaries, supervised failures where justified, and no GlobalScope.
4. Collect flows lifecycle-aware, distinguish cold and hot streams, avoid duplicate upstream work, and model loading, empty, error, and retry states explicitly.
5. Keep composables side-effect safe, hoist state to the correct owner, stabilize keys and models, bound recomposition, and measure startup and rendering before optimization.
6. Handle process death, configuration change, saved state, navigation, deep links, permissions, background work, offline sync, encrypted storage, and exported components.
7. Run static analysis, unit tests, coroutine and Flow tests, Compose UI tests, database and migration tests, release builds, and representative-device checks.

## Official references

- https://developer.android.com/topic/architecture/recommendations
- https://kotlinlang.org/docs/coroutines-guide.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
