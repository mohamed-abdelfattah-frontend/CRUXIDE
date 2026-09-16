---
name: crux-dotnet-architecture
description: Guide production .NET and ASP.NET Core services with clean boundaries, DI, async flows, security, and observability.
---

# CRUX .NET & ASP.NET Core

## Outcome

Guide production .NET and ASP.NET Core services with clean boundaries, DI, async flows, security, and observability.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Respect the target framework, nullable reference settings, analyzers, formatting, and solution structure already selected by the repository.
2. Keep endpoints and controllers thin; place use cases and domain behavior outside ASP.NET transport and EF Core persistence details.
3. Propagate CancellationToken, avoid sync-over-async, bound concurrency, and make lifetimes and disposal explicit.
4. Apply authentication, resource authorization, validation, rate limits, secrets, data protection, and safe error contracts centrally.
5. Test domain behavior, dependency wiring, EF Core mappings and transactions, API contracts, authorization, and release builds.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
