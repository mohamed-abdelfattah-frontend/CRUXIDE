---
name: crux-react-architecture
description: Guide React applications with clear component, state, server-data, routing, and error boundaries.
---

# CRUX React Architecture

## Outcome

Guide React applications with clear component, state, server-data, routing, and error boundaries.

## Workflow

1. Separate server state, client state, form state, and URL state instead of placing all data in one store.
2. Prefer composition and focused hooks over broad components, prop drilling, or premature global state.
3. Keep effects synchronized with external systems only; derive render data without effects when possible.
4. Design Suspense, loading, error, offline, empty, and retry behavior at meaningful boundaries.
5. Validate memoization and performance changes with measurements rather than habit.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
