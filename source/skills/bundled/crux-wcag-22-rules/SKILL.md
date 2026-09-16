---
name: crux-wcag-22-rules
description: Standalone WCAG 2.2 implementation and verification rules covering Levels A, AA, and AAA without treating automated scans as proof of conformance.
---

# CRUX WCAG 2.2 Rules

## Outcome

Standalone WCAG 2.2 implementation and verification rules covering Levels A, AA, and AAA without treating automated scans as proof of conformance.

## Version policy

Confirm the project or contractual WCAG target before applying this pack. Prefer WCAG 2.2 Level AA for new work when no target is declared, while preserving any mandated older version and testing its additional reporting requirements separately.

Last reviewed: 2026-09-16.

## Workflow

1. Confirm the exact WCAG version, target level, product scope, supported user agents, accessibility-supported technologies, exceptions, contractual requirements, and evidence owner before implementation; when no target is declared, recommend WCAG 2.2 Level AA but do not silently replace repository or legal policy.
2. Apply the selected level to complete pages and complete user processes, not isolated components; include responsive states, authentication, errors, overlays, embedded content, documents, third-party journeys, and failure or recovery paths that are part of the scoped experience.
3. Meet Perceivable requirements with equivalent text alternatives, captions and required media alternatives, semantic information and relationships, meaningful sequence, orientation independence, adaptable presentation, color-independent meaning, sufficient text and non-text contrast, text resizing, reflow, text spacing, and controllable hover or focus content.
4. Meet Operable requirements with complete keyboard access and no traps, adjustable timing, pause or stop controls, seizure-safe content, bypass mechanisms, descriptive titles and headings, logical focus order, visible and unobscured focus, multiple navigation methods, pointer cancellation, alternatives to dragging, adequate target size, and motion alternatives.
5. Meet Understandable requirements with declared language, predictable navigation and identification, consistent help, persistent labels and instructions, clear error identification and recovery, prevention for consequential submissions, reduced redundant entry, and authentication that does not depend on prohibited cognitive-function tests.
6. Meet Robust requirements by preferring native semantics, exposing correct accessible name, role, value, state, relationships, and status messages, maintaining valid platform accessibility mappings, and testing custom controls against the supported browser and assistive-technology matrix.
7. Design and content review must cover reading order, landmarks, headings, forms, tables, live regions, dialogs, focus restoration, zoom, high contrast, reduced motion, touch, dynamic content, localization, RTL, cognitive load, plain instructions, and alternatives for sensory-only directions.
8. Verify each applicable success criterion with criterion-level evidence using automated checks plus manual keyboard, screen-reader, zoom and reflow, contrast, pointer or touch, and representative-user testing where required; record environment, result, defect severity, owner, remediation, retest, and any scoped exception.
9. Never claim WCAG conformance from an automated score, a component-library label, partial-page testing, or passing only selected criteria; formal claims must identify version, level, scope, technologies, date, known limitations, and qualified human approval.
10. When BITV 2.0 or BFSG rules are also selected, reuse valid technical evidence but retain each standard's separate scope, documentation, reporting, consumer-process, and legal obligations; apply the union of applicable requirements and surface conflicts for human decision.

## Official references

- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.w3.org/WAI/test-evaluate/

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
