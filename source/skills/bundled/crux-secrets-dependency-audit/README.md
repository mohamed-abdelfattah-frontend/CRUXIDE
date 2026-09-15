# CRUX Secrets & Dependency Audit

Review repositories for exposed secrets, risky packages, lockfile drift, and unsafe dependency practices.

## Benefits

- Review repositories for exposed secrets, risky packages, lockfile drift, and unsafe dependency practices.

## When to use

- Use when the task matches: Review repositories for exposed secrets, risky packages, lockfile drift, and unsafe dependency practices.

## Compatibility

- Agents: codex, claude-code, copilot, cursor, gemini, generic
- Category: Security
- Type: skill
- Status: recommended
- Required with CRUX Skills installs: false
- Invocation: automatic or explicit when supported
- Source: crux
- Version: 1.0.0
- License: MIT

## Permissions

| Capability | Requirement |
| --- | --- |
| Filesystem | read |
| Network | false |
| Scripts | false |
| Hooks | false |
| Authentication | false |

## Installation

Use CRUXIDE Skills Manager and select **CRUX Secrets & Dependency Audit**, the target agent, and Project Local, Project Shared, or User scope. Manual installation copies this folder into the agent's supported skills directory.

## Project impact

CRUXIDE never adds application runtime dependencies automatically. Project Local installs are excluded from Git by default. External runtimes and caches stay outside the application project unless the developer explicitly chooses otherwise.

## Uninstall

Use **CRUXIDE: Manage Skills**, select the installed skill, and choose Uninstall. Review any project-authored changes before removal.

## Source

Developed by CRUX Team and distributed with CRUXIDE.
