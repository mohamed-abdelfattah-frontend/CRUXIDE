# Changelog

All notable changes follow Keep a Changelog conventions.

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
