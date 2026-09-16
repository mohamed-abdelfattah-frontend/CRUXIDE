# CRUXIDE

The CRUXCODE developer experience for Visual Studio Code.

CRUXIDE adds a track-based VS Code setup, CRUX themes, a branded 4K Home experience, curated developer tooling, Roboto Mono code typography, and CRUX Skills: a portable capability and rules layer for AI coding agents. It does not replace or patch Microsoft VS Code binaries.

## Highlights

- CRUXIDE Dark and Light themes.
- Home opens when there is no workspace or no recognized code file.
- Responsive 3840×2160 CRUXCODE artwork at the bottom of Home, packaged locally for offline use.
- CRUXIDE Setup with all tracks selected by default and an explicit review/confirmation step before installation.
- Frontend, native mobile, backend, Python/AI, data, DevOps, design, collaboration, testing, and agent/review tracks.
- CRUX Skills Manager with bundled CRUX skills/rules and documented provider integrations.
- Agent adapters for Codex, Claude Code, GitHub Copilot, Cursor, Gemini, and generic skill-aware agents.
- Project Local, Project Shared, and User Global scopes; optional Guidance, Warning, Strict, and Custom rule modes.
- About section for CRUXIDE, CRUX Team, and founder Mohamed Khaled Abdelfattah, with fixed CRUXCODE and LinkedIn links.
- Exact CRUX symbol exported from Figma master component `21:3` (geometry `21:5`) and favicon component `22:104`.
- Space Grotesk headings, Inter UI copy, and Roboto Mono code typography from the CRUXCODE brand system.
- Conditional, deduplicated Marketplace installation based on selected tracks; existing tools are preserved and never intentionally downgraded.
- CRUXIDE Activity Bar actions and onboarding walkthrough.
- Windows Desktop/Start Menu launcher with the CRUX icon.
- macOS user-level `CRUXIDE.app` launcher.
- No application runtime dependencies, telemetry, background network requests, extension-host child processes, or workspace code execution.
- Restricted webview resource roots, strict Content Security Policy, and validated messages.
- Dedicated profile: your normal VS Code profile is not replaced.

## Windows installation

1. Extract `CRUXIDE-v1.0.1.zip` completely.
2. Open PowerShell inside the extracted folder.
3. Run:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\install-windows.ps1
   ```

4. Start **CRUXIDE** from the new Desktop or Start Menu shortcut.

The installer validates the VSIX, icon, and font SHA-256 checksums; binds `code.cmd` to the same Microsoft-signed `Code.exe` installation; creates the profile when missing; installs and verifies CRUXIDE; installs Roboto Mono per-user; and creates shortcuts whose target is `Code.exe`. Track-specific tools are selected later inside CRUXIDE with explicit consent. The installer's isolated child-process wrapper prevents harmless Node warnings from becoming `NativeCommandError` failures in Windows PowerShell 5.

## macOS installation

In VS Code, run **Shell Command: Install 'code' command in PATH** once. Extract `CRUXIDE-v1.0.1.zip`, open Terminal in the folder, and run:

```bash
chmod +x ./install-macos.sh
./install-macos.sh
```

This validates the checksum and creates `~/Applications/CRUXIDE.app`.

## Manual VSIX installation

```bash
code --profile "CRUXIDE" --new-window
code --profile "CRUXIDE" --install-extension ./cruxide-1.0.1.vsix --force
code --profile "CRUXIDE" --new-window
```

You can also choose **Extensions → More Actions → Install from VSIX…**.

## First launch

CRUXIDE offers **CRUXIDE Setup** on first launch. All tracks are selected initially, but nothing installs until the developer reviews the plan and confirms VS Code's modal dialog. The user can apply the plan to the active profile or open VS Code Profiles first and create/switch to a dedicated CRUXIDE profile.

After setup, the CRUXIDE experience sets:

- `workbench.colorTheme` to `CRUXIDE Dark`;
- `workbench.iconTheme` to Material Icon Theme;
- the window title to begin with `CRUXIDE`;
- `Roboto Mono` for the editor and integrated terminal;
- editor font ligatures to enabled.

Run `CRUXIDE: Apply CRUXIDE Experience` at any time to reapply them.

## Commands

- `CRUXIDE: Open Home`
- `CRUXIDE: Setup & Manage Tracks`
- `CRUXIDE: Skills Manager`
- `CRUXIDE: Apply CRUXIDE Experience`
- `CRUXIDE: Open Project Folder`
- `CRUXIDE: New Code File`
- `CRUXIDE: Manage Developer Tools`

## Settings

- `cruxide.openHomeOnEmpty`
- `cruxide.promptToOpenSetupOnFirstRun`
- `cruxide.codeFileExtensions`

## Curated developer tools

The track catalog covers Angular, React, React Native, Next.js, Tailwind CSS, shadcn/ui, native Android/Kotlin, iOS/Swift, Flutter/Dart, Node.js, Express, NestJS, PHP/Laravel, .NET/ASP.NET Core, Java/Spring Boot, Go, Rust, Python, AI/data science, databases, formatting, linting, Git/GitHub, containers, testing, AI assistants, design, documentation, and productivity. See `EXTENSIONS.md` for the track map. VS Code downloads only the confirmed missing tools; CRUXIDE does not embed or republish their binaries.

CRUXIDE installs editor integrations, not external runtimes or SDKs. Node.js, Python, PHP, Composer, JDK, .NET SDK, Go, Rust, Flutter, Android SDK/Android Studio, Swift, and Xcode remain separate developer prerequisites.

## CRUX Skills

Open **CRUXIDE: Skills Manager**, select skills/rules and one or more agents, then choose a scope:

- **Project Local** (default) stores canonical files in `.crux`, adds only a private managed block to `.git/info/exclude`, and leaves the repository's shared `.gitignore` untouched.
- **Project Shared** keeps portable skill files available for team review and commit while `.crux/.gitignore` excludes backups, caches, logs, runtime files, local state, and secrets.
- **User Global** stores canonical skills under `~/.cruxide` and adds small adapter files to the selected agents' user-level skills directories.

Bundled skills are plain Markdown instructions with no executable hooks. Every catalog item has a README describing purpose, compatibility, permissions, installation, impact, source, license, and removal. Provider-managed entries such as Archify, CodeRabbit, Trail of Bits, Superpowers, and Context7 are not downloaded or executed: CRUXIDE creates a review guide and links to the provider's source.

The recommended rule packs include senior solution architecture, technical leadership, security, testing, performance, accessibility, APIs, AI work, ESLint, and Git workflow. Technology-specific packs cover TypeScript/JavaScript, HTML/CSS, Angular, React, Next.js, React Native/Expo, Kotlin/Android/Compose, Swift/iOS/SwiftUI, Dart/Flutter, Node.js, Express, NestJS, PHP, Laravel, C#/.NET/ASP.NET Core, Java/Spring Boot, Go, Rust, Python, SQL/databases, containers/CI/CD, and AI/RAG/agents.

Accessibility standards are available as three independent rule packs: **WCAG 2.2**, **BITV 2.0**, and **BFSG**. A developer can select any one, any pair, or all three. When combined, CRUXIDE applies the union of applicable requirements and reuses valid test evidence without treating one standard as proof of another. Automated scans are never sufficient for a formal conformance claim, and BITV/BFSG scope or legal compliance requires qualified human review.

Every CRUX technology rule pack is version-aware: the agent must inspect the repository's actual language, framework, runtime, and toolchain versions before applying guidance. Each pack records its review date, pack version, compatibility policy, and official references. Project-supported versions and repository policy take precedence; migrations and deprecated-API removal are proposed separately with compatibility, verification, and rollback notes.

Rules are optional and can be extended or overridden by project instructions. Git workflow guidance uses `feat/`, `fix/`, `docs/`, `style/`, `refactor/`, `test/`, `chore/`, `perf/`, `ci/`, and `build/` branch prefixes and Conventional Commits. CRUXIDE never edits `package.json`, installs packages, creates Git hooks, or adds files to the application bundle without explicit developer action.

Every confirmed project installation generates `.crux/PROJECT_RULES.md` from the selected rule packs and preserves its **Custom Project Rules** section on regeneration. A root `PROJECT_RULES.md` link and agent-specific managed instructions point Codex, Claude Code, GitHub Copilot, Cursor, and Gemini to the canonical rules. Existing project-authored files are backed up and preserved outside CRUXIDE-managed blocks.

## Build and verify

Requirements: Node.js 22 and npm 11.

```bash
npm ci
npm run verify
npm run package:release
```

`npm run verify` runs strict TypeScript checks, ESLint, tests, a high-severity dependency audit, and npm registry signature verification. `npm run package:release` additionally validates every curated ID against the Visual Studio Marketplace and produces `release/CRUXIDE-v1.0.1.zip` with the installers, VSIX, skills catalog, checksums, fonts, icon, and complete source.

## Security and privacy

See the packaged `SECURITY.md`, `PRIVACY.md`, and `THREAT_MODEL.md` files.

## Application identity limitation

A VS Code profile cannot replace Microsoft's executable, process identity, top-left product icon, or guaranteed running taskbar icon. The Windows Desktop/Start shortcuts and macOS launcher use the exact CRUX favicon. A fully independent binary/taskbar identity requires a separately maintained Code-OSS distribution with the applicable product configuration and trademarks.
