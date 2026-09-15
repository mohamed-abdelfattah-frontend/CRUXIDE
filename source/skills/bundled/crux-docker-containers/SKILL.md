---
name: crux-docker-containers
description: Create secure, reproducible, minimal container builds and local compositions.
---

# CRUX Docker & Containers

## Outcome

Create secure, reproducible, minimal container builds and local compositions.

## Workflow

1. Use pinned base images, multi-stage builds, non-root runtime users, and minimal production artifacts.
2. Keep secrets out of layers, build arguments, images, logs, and committed configuration.
3. Define health checks, signals, graceful shutdown, resource limits, and read-only filesystems when practical.
4. Keep development conveniences separate from production images.
5. Scan and test the final image rather than only the source workspace.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
