---
name: crux-nextjs-architecture
description: Design secure Next.js App Router systems across server, client, caching, routing, and metadata boundaries.
---

# CRUX Next.js Architecture

## Outcome

Design secure Next.js App Router systems across server, client, caching, routing, and metadata boundaries.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Default to Server Components and introduce Client Components only at explicit interactive boundaries.
2. Keep secrets and privileged data access server-only and validate every Server Action and Route Handler input.
3. Choose cache, revalidation, dynamic rendering, and streaming behavior deliberately per data source.
4. Separate route composition from feature logic and keep metadata, errors, loading, and not-found states explicit.
5. Test server/client boundaries, authorization, caching invalidation, and production builds.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
