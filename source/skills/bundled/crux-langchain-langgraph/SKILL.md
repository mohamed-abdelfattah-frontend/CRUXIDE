---
name: crux-langchain-langgraph
description: Build observable LangChain and LangGraph workflows with typed state and reliable recovery.
---

# CRUX LangChain & LangGraph

## Outcome

Build observable LangChain and LangGraph workflows with typed state and reliable recovery.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define typed graph state, node contracts, transitions, terminal states, checkpoints, and error paths.
2. Keep model prompts, tools, retrieval, memory, and domain services independently testable.
3. Use deterministic nodes for deterministic work and bound loops, retries, and tool calls.
4. Design human approval, interruption, persistence, replay, and version migration explicitly.
5. Trace node inputs and outputs while redacting secrets and sensitive content.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
