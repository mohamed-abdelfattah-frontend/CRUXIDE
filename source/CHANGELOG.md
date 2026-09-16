# Changelog

All notable changes follow Keep a Changelog conventions.

## Unreleased

### Senior architecture and technology rules

- Added version-aware rule packs for every supported language and framework track.
- Added dedicated Senior Solution Architecture and Senior Technical Lead rule packs.
- Added official references, review dates, compatibility policy, and pack versions to generated skill documentation and project rules.
- Added production guidance for frontend, native mobile, backend, databases, containers/CI/CD, and AI/RAG/agent systems.
- Added regression coverage requiring substantial rules and complete track-to-rule mappings.

### Accessibility standards

- Added independently selectable WCAG 2.2, BITV 2.0, and BFSG rule packs with official references and standalone implementation, testing, evidence, and review workflows.
- Added deterministic composition guidance for selecting one, two, or all three standards: apply the union, reuse valid technical evidence, preserve separate statutory duties, and require qualified human review for formal claims.
- Added a dedicated Accessibility Standards setup track with no application runtime dependencies or additional editor extensions.

### Added

- Added consent-based first-run **CRUXIDE Setup** with 23 selectable tracks and an all-tracks default that can be reduced before installation.
- Added native Android/Kotlin, iOS/Swift, Flutter/Dart, React Native/Expo, Python/AI/data, PHP/Laravel, .NET/ASP.NET Core, Java/Spring Boot, Go/Rust, database, DevOps, and review tooling.
- Added CRUX skills for PHP, Laravel, .NET, Spring Boot, Go/Rust, Python AI/backend engineering, and databases; the all-track preset maps the complete skills catalog.
- Added generated `.crux/PROJECT_RULES.md`, a root pointer, and managed agent instructions for Codex, Claude Code, GitHub Copilot, Cursor, and Gemini while preserving custom rules and existing project-authored content.
- Added platform filtering, prerequisite disclosure, setup state, and a generated extension/track reference.

### Changed

- Replaced the static 61-extension manifest with track-specific, deduplicated installation after explicit confirmation.
- Offline Windows and macOS installers now install and verify CRUXIDE only; track tooling is selected inside the active profile.
- Deselecting a track never silently removes an extension, and already-installed or application-provided tools are not downgraded.

### Security

- Added strict setup-message validation, fixed source-controlled Marketplace IDs, local-only setup assets, a restrictive CSP, trusted-workspace checks for project rules, and backups before managed project-file updates.

## 1.0.1 - 2026-09-15

### Fixed

- Made Windows per-user Roboto Mono installation idempotent by skipping byte-identical installed font files instead of attempting to overwrite files currently loaded by VS Code.
- Added content-addressed fallback filenames when an existing per-user font path contains different bytes, preserving integrity without replacing a locked font.

## 1.0.0 - 2026-09-15

### Added

- Added the CRUXIDE branded VS Code experience with Figma-aligned CRUXCODE identity, dark and light themes, exact logo assets, custom application shortcuts, and offline typography.
- Added a responsive 4K Home experience and About section for CRUXIDE, CRUX Team, founder Mohamed Khaled Abdelfattah, company website, and LinkedIn profile.
- Added a curated 61-extension developer toolset covering Angular, React, React Native, Next.js, Tailwind CSS, shadcn/ui, NestJS, Express, Git, GitHub, testing, containers, AI assistants, autocomplete, spelling, JSON, documentation, and productivity.
- Added CRUX Skills Manager with searchable selection across bundled CRUX skills, recommended rule packs, and provider-managed references for Codex, Claude Code, GitHub Copilot, Cursor, Gemini, and generic skill-aware agents.
- Added CRUX Conductor as the required, explicit-only orchestration skill: one prompt selects the minimum relevant installed skills, resolves conflicts, coordinates structured handoffs, and verifies one coherent result.
- Added Windows and macOS installers, deterministic release archives, SHA-256 manifests, complete source, font assets, icon assets, and VSIX packaging.

### Security

- Webviews use restrictive Content Security Policy, local assets, strict message validation, and fixed allowlists for external navigation.
- Skills installation requires Workspace Trust, confines writes to known roots, backs up managed skill folders, and never executes provider code or modifies application dependencies or Git hooks.
- Installers verify release checksums, extension identity, curated extension availability, and the Microsoft signature of the paired Windows VS Code executable.
- Release verification includes TypeScript, ESLint, automated tests, high-severity dependency audit, npm registry signatures, and Marketplace ID validation.

### Compatibility

- Windows PowerShell 5.1 or later with a supported Visual Studio Code installation.
- macOS with the VS Code `code` command enabled in `PATH`.
- Packaging supports current Node.js releases, including Node.js 24 on Windows, without spawning `npx.cmd` from Node.
