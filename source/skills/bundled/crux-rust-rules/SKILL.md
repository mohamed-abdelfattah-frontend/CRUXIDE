---
name: crux-rust-rules
description: Rust rules for ownership, explicit errors, safe concurrency, unsafe boundaries, Cargo integrity, and production verification.
---

# CRUX Rust Rules

## Outcome

Rust rules for ownership, explicit errors, safe concurrency, unsafe boundaries, Cargo integrity, and production verification.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the Rust toolchain, edition, MSRV, workspace, features, targets, Cargo policy, and generated code before selecting language or library APIs.
2. Model ownership and lifetimes clearly; prefer borrowing and simple owned values over cloning, interior mutability, or complex lifetime abstraction without evidence.
3. Use Result and typed errors for recoverable failure, preserve source context, avoid unwrap or expect in production paths, and do not use panic for normal control flow.
4. Keep unsafe code minimal, isolated, documented with safety invariants, and covered by focused tests or interpreters where available; reject undocumented unsafe blocks.
5. Bound tasks, threads, channels, locks, buffers, retries, and blocking work; design cancellation, shutdown, Send or Sync constraints, and poisoned or failed state explicitly.
6. Preserve Cargo.lock according to package type, review build scripts and features, minimize dependency and supply-chain surface, and avoid hidden network-dependent builds.
7. Run rustfmt, clippy with project policy, tests, doc tests, feature combinations, security or dependency audits when configured, and release builds for supported targets.

## Official references

- https://doc.rust-lang.org/book/
- https://doc.rust-lang.org/book/appendix-04-useful-development-tools.html

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
