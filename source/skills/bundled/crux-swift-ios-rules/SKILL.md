---
name: crux-swift-ios-rules
description: Swift, SwiftUI, structured-concurrency, platform-security, accessibility, and release-quality rules.
---

# CRUX Swift & iOS Rules

## Outcome

Swift, SwiftUI, structured-concurrency, platform-security, accessibility, and release-quality rules.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect Swift language mode, deployment targets, Xcode project settings, package versions, and UIKit or SwiftUI boundaries before selecting APIs.
2. Keep views declarative and place state ownership, domain logic, persistence, networking, navigation, and side effects behind explicit observable boundaries.
3. Use structured concurrency, actor isolation, Sendable correctness, cancellation, and explicit MainActor transitions; avoid detached or unstructured tasks without lifecycle ownership.
4. Model navigation, deep links, background execution, permissions, restoration, offline behavior, errors, and session expiry as testable state transitions.
5. Store credentials and sensitive material in Keychain or platform-protected storage, minimize entitlements, redact logs, and validate universal links and incoming URLs.
6. Support Dynamic Type, VoiceOver, contrast, reduced motion, localization, RTL, safe areas, device classes, and interruption behavior.
7. Run unit, concurrency, UI, integration, migration, archive, signing, and supported-device checks; treat data-race warnings as correctness failures.

## Official references

- https://developer.apple.com/documentation/swift/adoptingswift6
- https://developer.apple.com/documentation/swift

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
