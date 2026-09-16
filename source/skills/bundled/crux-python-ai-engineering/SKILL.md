---
name: crux-python-ai-engineering
description: Build typed, reproducible, secure Python AI and data workflows with bounded resources, evaluation, and observability.
---

# CRUX Python AI Engineering

## Outcome

Build typed, reproducible, secure Python AI and data workflows with bounded resources, evaluation, and observability.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Use the repository Python version and environment manager; keep dependencies locked and do not install packages without approval.
2. Keep notebooks exploratory and move reusable production behavior into importable, typed, tested modules.
3. Validate untrusted data, model output, prompts, retrieved content, files, and tool responses at trust boundaries.
4. Bound memory, concurrency, batch sizes, tokens, retries, network calls, and execution time; make cancellation and cleanup explicit.
5. Use Ruff, type checking, tests, reproducible seeds or datasets, evaluation metrics, and redacted observability where the project supports them.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
