---
name: crux-ai-rag-production-rules
description: Production AI rules for evaluations, permissions, retrieval, prompt injection, tools, privacy, cost, observability, and human control.
---

# CRUX AI, Agents & RAG Production Rules

## Outcome

Production AI rules for evaluations, permissions, retrieval, prompt injection, tools, privacy, cost, observability, and human control.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define user outcome, failure cost, data classification, model and provider constraints, latency, cost budget, human oversight, and an evaluation set before implementation.
2. Treat prompts, retrieved content, model output, tool output, memory, files, and web content as untrusted; isolate instructions from data and validate downstream use.
3. Enforce identity and source-level authorization before retrieval or tool execution; never rely on the model to preserve access control or confidentiality.
4. Grant tools the minimum schema, permissions, data, time, and action scope; require approval for destructive, financial, external-message, privileged, or irreversible actions.
5. Bound tokens, loops, retries, fan-out, parallelism, retrieval size, file size, execution time, and spend with deterministic stop conditions and safe failure behavior.
6. Version prompts, models, embeddings, chunking, indexes, schemas, and evaluation datasets; measure retrieval quality separately from answer quality and regression-test changes.
7. Log traceable decisions, sources, latency, cost, tool calls, policy outcomes, and user feedback with redaction and retention controls; provide citations and calibrated uncertainty.
8. Test prompt injection, data poisoning, sensitive disclosure, improper output handling, excessive agency, unavailable tools, stale evidence, conflicting sources, and recovery.

## Official references

- https://genai.owasp.org/llm-top-10/
- https://www.nist.gov/itl/ai-risk-management-framework

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
