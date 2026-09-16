---
name: crux-accessibility-rules
description: Optional accessibility, localization, and RTL requirements for user interfaces.
---

# CRUX Accessibility Rules

## Outcome

Optional accessibility, localization, and RTL requirements for user interfaces.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Use semantic controls, accessible names, keyboard operation, and visible focus states.
2. Meet project contrast targets and respect reduced motion, zoom, reflow, and dynamic text.
3. Externalize user-facing text and support Arabic/English plus RTL/LTR when the project requires them.
4. Use logical layout properties and prevent unsafe bidirectional control characters.
5. Verify automated results with representative manual keyboard and assistive-technology checks.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
