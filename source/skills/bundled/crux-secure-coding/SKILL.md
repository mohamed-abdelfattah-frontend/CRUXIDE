---
name: crux-secure-coding
description: Apply secure-by-default patterns to authentication, input handling, data, APIs, and automation.
---

# CRUX Secure Coding

## Outcome

Apply secure-by-default patterns to authentication, input handling, data, APIs, and automation.

## Workflow

1. Identify assets, trust boundaries, entry points, identities, and attacker-controlled input before editing sensitive code.
2. Prefer HttpOnly, Secure, SameSite cookies for browser session tokens; do not store them in localStorage or sessionStorage.
3. Validate inputs at trust boundaries, encode outputs for their context, and use parameterized data access.
4. Avoid eval-like execution, unsafe shell interpolation, unbounded resource use, weak cryptography, and leaked secrets.
5. Report security limitations and require explicit approval before destructive or credential-bearing operations.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
