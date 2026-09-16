---
name: crux-web-platform-rules
description: HTML, CSS, browser security, accessibility, responsive, and internationalization rules for production web interfaces.
---

# CRUX Web Platform Rules

## Outcome

HTML, CSS, browser security, accessibility, responsive, and internationalization rules for production web interfaces.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Use semantic HTML and native interactive elements before ARIA; every control must have an accessible name, keyboard operation, visible focus, and correct disabled behavior.
2. Keep structure, behavior, and presentation separable; avoid invalid nesting, duplicated IDs, inaccessible custom controls, and layout encoded as document semantics.
3. Use logical CSS properties, resilient responsive layouts, design tokens, content-driven sizing, reduced motion, contrast, zoom, reflow, RTL, and localization-safe patterns.
4. Prevent injection with contextual escaping, trusted sanitization, restrictive CSP, safe URL handling, and no unsafe DOM HTML insertion for untrusted content.
5. Control third-party scripts, storage, permissions, cross-origin requests, cookies, and sensitive browser APIs according to least privilege and privacy requirements.
6. Set measurable performance budgets for critical rendering, JavaScript, fonts, images, layout stability, and interaction responsiveness; validate on representative devices.
7. Test loading, empty, error, offline, unauthorized, long-content, keyboard, screen-reader, high-zoom, RTL, and reduced-motion states.

## Official references

- https://html.spec.whatwg.org/
- https://www.w3.org/WAI/WCAG22/quickref/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
