---
name: crux-review-standard
description: Perform evidence-first review across correctness, architecture, security, tests, performance, and accessibility.
---

# CRUX Review Standard

## Outcome

Perform evidence-first review across correctness, architecture, security, tests, performance, and accessibility.

## Workflow

1. Read the change intent, diff, surrounding code, tests, and relevant history before raising findings.
2. Prioritize correctness, security, data loss, authorization, regressions, and contract breaks over style nits.
3. For every finding provide rule, severity, confidence, location, evidence, impact, and actionable remediation.
4. Suppress speculative or duplicated findings and distinguish blockers from optional improvements.
5. State review coverage and checks actually executed; never imply complete coverage without evidence.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
