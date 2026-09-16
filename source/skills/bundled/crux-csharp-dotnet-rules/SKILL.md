---
name: crux-csharp-dotnet-rules
description: C# and .NET rules for nullable safety, async I/O, DI lifetimes, ASP.NET Core, EF Core, security, and operations.
---

# CRUX C# & .NET Rules

## Outcome

C# and .NET rules for nullable safety, async I/O, DI lifetimes, ASP.NET Core, EF Core, security, and operations.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the target framework, SDK policy, nullable mode, analyzers, language version, solution boundaries, and deployment model before selecting APIs.
2. Keep nullable warnings meaningful, avoid null-forgiving suppression without proof, use explicit contracts and immutable records or value objects where appropriate.
3. Use async end to end for I/O, propagate CancellationToken, avoid async void and sync-over-async, and bound parallelism and large allocations.
4. Keep endpoints thin, validate inputs, authorize the concrete resource, use stable Problem Details, and never capture HttpContext or scoped services beyond the request lifetime.
5. Respect DI lifetimes and disposal; use HttpClientFactory, explicit options validation, safe secret providers, health checks, structured logs, metrics, traces, and graceful shutdown.
6. Make EF Core tracking, projections, transactions, concurrency tokens, migrations, query counts, and cancellation explicit; measure before compiled-query complexity.
7. Run format and analyzers, unit and integration tests, authorization and contract tests, migration validation, publish or trimming checks when applicable, and release builds.

## Official references

- https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices?view=aspnetcore-10.0

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
