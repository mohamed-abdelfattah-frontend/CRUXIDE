---
name: crux-design-system
description: Build and govern token-driven design systems from foundations through reusable components and patterns.
---

# CRUX Design System

## Outcome

Build and govern token-driven design systems from foundations through reusable components and patterns.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Start from color, typography, spacing, radius, elevation, motion, breakpoint, and accessibility tokens.
2. Use semantic tokens between primitives and components so themes do not leak raw palette choices.
3. Define component anatomy, variants, sizes, states, content rules, and interaction contracts.
4. Keep Figma and code naming aligned and record intentional differences.
5. Test accessibility, RTL, responsive behavior, visual regression, and theming.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
