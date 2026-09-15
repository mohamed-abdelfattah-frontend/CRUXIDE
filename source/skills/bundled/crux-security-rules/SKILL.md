---
name: crux-security-rules
description: Optional secure-coding rules for authentication, validation, secrets, dependencies, and unsafe execution.
---

# CRUX Security Rules

## Outcome

Optional secure-coding rules for authentication, validation, secrets, dependencies, and unsafe execution.

## Workflow

1. Do not store browser session tokens in localStorage or sessionStorage; prefer HttpOnly Secure SameSite cookies.
2. Validate attacker-controlled input at trust boundaries and encode output for its destination context.
3. Do not commit secrets, log sensitive data, execute untrusted text, or interpolate untrusted shell input.
4. Use least privilege for files, APIs, CI, cloud roles, databases, and agent tools.
5. Escalate auth, crypto, payment, destructive, or data-migration changes for explicit review.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
