---
name: crux-conductor
description: Explicitly orchestrate the minimum relevant installed skills for a prompt and project, resolve conflicts, coordinate structured handoffs, and verify one coherent result.
disable-model-invocation: true
---

# CRUX Conductor

## Outcome

Explicitly orchestrate the minimum relevant installed skills for a prompt and project, resolve conflicts, coordinate structured handoffs, and verify one coherent result.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Invocation

- Run only after explicit user invocation. Do not invoke this skill automatically.
- Use the command syntax supported by the current agent, such as `/crux-conductor` or `$crux-conductor`.

## Workflow

1. Run only when the user explicitly invokes CRUX Conductor; never activate it merely because a task could benefit from orchestration.
2. Analyze the original prompt and inspect only the project context needed to identify the stack, task type, constraints, risks, and expected outcome.
3. Discover installed skills from the CRUX registry, distinguish ready skills from external guides, and select the minimum sufficient compatible set.
4. Treat skills explicitly named or selected by the user as pinned: keep them in the plan unless unavailable, and surface any material conflict instead of silently dropping them.
5. Resolve prerequisites, overlap, ordering, and conflicts before execution; user intent and project-authored instructions take precedence, and unresolved material conflicts require clarification.
6. Create an acyclic execution plan, delegate independent work in parallel only when the agent supports it, and otherwise sequence skills in one session.
7. Pass concise structured handoffs containing objective, relevant inputs, decisions, constraints, evidence, blockers, artifacts, required checks, and the next skill.
8. Do not claim a skill, provider integration, command, test, or check ran unless evidence confirms it; never install dependencies or expand scope without authorization.
9. Verify the combined result against the original prompt, selected skill requirements, project rules, and checks actually executed; report coverage, conflicts, skipped work, and residual risk.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.

## Intellectual property ownership

The intellectual property rights in the **CRUX Conductor concept, orchestration design, and skill workflow** belong to [Eng. Mohamed Osama](https://www.linkedin.com/in/mohamedosama96/), Senior Android Engineer | Kotlin, Jetpack Compose. Distribution and use of the implementation remain subject to the repository license and any applicable written contributor or ownership agreements.
