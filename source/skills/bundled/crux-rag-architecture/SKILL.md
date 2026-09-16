---
name: crux-rag-architecture
description: Design retrieval-augmented generation systems with measurable relevance, grounding, and safety.
---

# CRUX RAG Architecture

## Outcome

Design retrieval-augmented generation systems with measurable relevance, grounding, and safety.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Define the user task, corpus ownership, freshness, permissions, latency, cost, and evaluation set.
2. Design ingestion, chunking, metadata, embeddings, retrieval, reranking, context assembly, and citations explicitly.
3. Enforce document-level authorization before retrieval and treat retrieved text as untrusted input.
4. Measure retrieval and answer quality separately and include adversarial, stale, empty, and conflicting evidence cases.
5. Add observability for sources, versions, latency, token use, failures, and user feedback.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
