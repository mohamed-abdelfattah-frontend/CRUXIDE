# CRUX PHP Rules

Supported-PHP rules for types, Composer, boundaries, security, errors, static analysis, and production behavior.

## Benefits

- Supported-PHP rules for types, Composer, boundaries, security, errors, static analysis, and production behavior.

## When to use

- Use when the task matches: Supported-PHP rules for types, Composer, boundaries, security, errors, static analysis, and production behavior.

## Compatibility

- Agents: codex, claude-code, copilot, cursor, gemini, generic
- Category: Technology Rules
- Type: rule-pack
- Status: recommended
- Required with CRUX Skills installs: false
- Invocation: automatic or explicit when supported
- Source: crux
- Version: 1.1.0
- Last reviewed: 2026-09-16
- License: MIT

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

## Official references

- https://www.php.net/supported-versions.php
- https://www.php.net/manual/en/security.php

## Permissions

| Capability | Requirement |
| --- | --- |
| Filesystem | read |
| Network | false |
| Scripts | false |
| Hooks | false |
| Authentication | false |

## Installation

Use CRUXIDE Skills Manager and select **CRUX PHP Rules**, the target agent, and Project Local, Project Shared, or User scope. Manual installation copies this folder into the agent's supported skills directory.

## Project impact

CRUXIDE never adds application runtime dependencies automatically. Project Local installs are excluded from Git by default. External runtimes and caches stay outside the application project unless the developer explicitly chooses otherwise.

## Uninstall

Use **CRUXIDE: Manage Skills**, select the installed skill, and choose Uninstall. Review any project-authored changes before removal.

## Source

Developed by CRUX Team and distributed with CRUXIDE.
