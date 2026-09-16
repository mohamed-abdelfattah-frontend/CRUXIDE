---
name: crux-accessibility-i18n
description: Apply WCAG-minded semantics, keyboard support, localization, and bidirectional layout.
---

# CRUX Accessibility & i18n

## Outcome

Apply WCAG-minded semantics, keyboard support, localization, and bidirectional layout.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Use native semantics first and give every interactive control an accessible name and visible focus state.
2. Support keyboard navigation, zoom, reflow, contrast, reduced motion, screen readers, and error announcements.
3. Externalize user-facing text and design layouts for expansion, Arabic, English, RTL, and LTR.
4. Keep logical CSS properties and isolate or remove unsafe bidirectional control characters.
5. Validate with automated checks plus keyboard and screen-reader-oriented manual review.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
