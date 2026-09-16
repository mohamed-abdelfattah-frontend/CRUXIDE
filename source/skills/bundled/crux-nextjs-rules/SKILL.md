---
name: crux-nextjs-rules
description: Version-aware Next.js App Router rules for server/client boundaries, caching, mutations, routing, security, and deployment.
---

# CRUX Next.js Rules

## Outcome

Version-aware Next.js App Router rules for server/client boundaries, caching, mutations, routing, security, and deployment.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Next.js major version, router type, runtime, deployment target, and whether Cache Components are enabled before applying routing or caching guidance.
2. Default App Router code to Server Components and introduce Client Components only for explicit browser state, effects, events, or client-only APIs.
3. Keep secrets, privileged data access, credentials, and trusted authorization checks server-only; validate and authorize every Route Handler and Server Action input.
4. Choose dynamic rendering, prerendering, streaming, cache lifetime, tags, and invalidation deliberately per data source; do not copy caching APIs across incompatible Next.js versions.
5. Do not treat middleware, layouts, hidden UI, or client redirects as authorization; enforce access at the server resource boundary.
6. Keep route files compositional, define metadata, loading, error, not-found, and redirect behavior, and avoid passing unnecessary data across the server/client serialization boundary.
7. Test production builds, server/client separation, caching and invalidation, authorization, SEO metadata, hydration, runtime compatibility, and deployment-specific behavior.

## Official references

- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/getting-started/caching

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
