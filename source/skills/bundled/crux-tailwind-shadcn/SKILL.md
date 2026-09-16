---
name: crux-tailwind-shadcn
description: Build accessible, token-driven Tailwind and shadcn/ui interfaces without losing product identity.
---

# CRUX Tailwind & shadcn/ui

## Outcome

Build accessible, token-driven Tailwind and shadcn/ui interfaces without losing product identity.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Map design tokens to semantic CSS variables and Tailwind utilities instead of scattering literal values.
2. Treat shadcn/ui as editable source code and preserve accessibility behavior when customizing components.
3. Compose variants consistently and avoid long duplicated utility strings.
4. Implement keyboard, focus, reduced-motion, RTL, responsive, empty, loading, and error states.
5. Verify the result visually and with automated accessibility checks where available.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
