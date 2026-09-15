# CRUXIDE

The CRUXCODE developer experience for Visual Studio Code.

CRUXIDE adds a dedicated VS Code profile, CRUX themes, a branded 4K Home experience, a curated 61-extension toolset, Roboto Mono code typography, and CRUX Skills: an optional portable capability layer for AI coding agents. It does not replace or patch Microsoft VS Code binaries.

## Highlights

- CRUXIDE Dark and Light themes.
- Home opens when there is no workspace or no recognized code file.
- Responsive 3840×2160 CRUXCODE artwork at the bottom of Home, packaged locally for offline use.
- CRUX Skills Manager with 44 bundled CRUX skills/rules and 38 documented provider integrations.
- Agent adapters for Codex, Claude Code, GitHub Copilot, Cursor, Gemini, and generic skill-aware agents.
- Project Local, Project Shared, and User Global scopes; optional Guidance, Warning, Strict, and Custom rule modes.
- About section for CRUXIDE, CRUX Team, and founder Mohamed Khaled Abdelfattah, with fixed CRUXCODE and LinkedIn links.
- Exact CRUX symbol exported from Figma master component `21:3` (geometry `21:5`) and favicon component `22:104`.
- Space Grotesk headings, Inter UI copy, and Roboto Mono code typography from the CRUXCODE brand system.
- Sixty-one curated extensions selected together from the supplied VS Code profile, all verified by exact ID after installation.
- CRUXIDE Activity Bar actions and onboarding walkthrough.
- Windows Desktop/Start Menu launcher with the CRUX icon.
- macOS user-level `CRUXIDE.app` launcher.
- No application runtime dependencies, telemetry, background network requests, child processes, or workspace code execution.
- Restricted webview resource roots, strict Content Security Policy, and validated messages.
- Dedicated profile: your normal VS Code profile is not replaced.

## Windows installation

1. Extract `CRUXIDE-v1.0.0.zip` completely.
2. Open PowerShell inside the extracted folder.
3. Run:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\install-windows.ps1
   ```

4. Start **CRUXIDE** from the new Desktop or Start Menu shortcut.

The installer validates the VSIX, icon, and font SHA-256 checksums; binds `code.cmd` to the same Microsoft-signed `Code.exe` installation; creates the profile when missing; installs the extension pack; verifies all 62 extension IDs (CRUXIDE plus 61 tools); installs Roboto Mono per-user; and creates shortcuts whose target is `Code.exe`. Its isolated child-process wrapper prevents harmless Node warnings from becoming `NativeCommandError` failures in Windows PowerShell 5.

## macOS installation

In VS Code, run **Shell Command: Install 'code' command in PATH** once. Extract `CRUXIDE-v1.0.0.zip`, open Terminal in the folder, and run:

```bash
chmod +x ./install-macos.sh
./install-macos.sh
```

This validates the checksum and creates `~/Applications/CRUXIDE.app`.

## Manual VSIX installation

```bash
code --profile "CRUXIDE" --new-window
code --profile "CRUXIDE" --install-extension ./cruxide-1.0.0.vsix --force
code --profile "CRUXIDE" --new-window
```

You can also choose **Extensions → More Actions → Install from VSIX…**.

## First launch

CRUXIDE asks before changing profile-scoped editor settings. Choose **Apply CRUXIDE** to set:

- `workbench.colorTheme` to `CRUXIDE Dark`;
- `workbench.iconTheme` to Material Icon Theme;
- the window title to begin with `CRUXIDE`;
- `Roboto Mono` for the editor and integrated terminal;
- editor font ligatures to enabled.

Run `CRUXIDE: Apply CRUXIDE Experience` at any time to reapply them.

## Commands

- `CRUXIDE: Open Home`
- `CRUXIDE: Skills Manager`
- `CRUXIDE: Apply CRUXIDE Experience`
- `CRUXIDE: Open Project Folder`
- `CRUXIDE: New Code File`
- `CRUXIDE: Manage Developer Tools`

## Settings

- `cruxide.openHomeOnEmpty`
- `cruxide.promptToApplyExperienceOnFirstRun`
- `cruxide.codeFileExtensions`

## Curated developer tools

The selected toolset covers Angular, React, React Native, Next.js, Tailwind CSS, shadcn/ui, NestJS, Express, Node.js, formatting, linting, autocomplete, code spelling, Git/GitHub, containers, testing, AI assistants, JSON/data utilities, README preview, Todo Tree, and Markdown Tree. See `EXTENSIONS.md` for all 61 exact Marketplace IDs. Git and JavaScript/TypeScript/JSX support are already built into VS Code. The legacy `github.copilot` package is intentionally excluded in favor of `github.copilot-chat`. VS Code downloads the selected tools; CRUXIDE does not embed or republish their binaries.

## CRUX Skills

Open **CRUXIDE: Skills Manager**, select skills/rules and one or more agents, then choose a scope:

- **Project Local** (default) stores canonical files in `.crux`, adds only a private managed block to `.git/info/exclude`, and leaves the repository's shared `.gitignore` untouched.
- **Project Shared** keeps portable skill files available for team review and commit while `.crux/.gitignore` excludes backups, caches, logs, runtime files, local state, and secrets.
- **User Global** stores canonical skills under `~/.cruxide` and adds small adapter files to the selected agents' user-level skills directories.

Bundled skills are plain Markdown instructions with no executable hooks. Every catalog item has a README describing purpose, compatibility, permissions, installation, impact, source, license, and removal. Provider-managed entries such as Archify, CodeRabbit, Trail of Bits, Superpowers, and Context7 are not downloaded or executed: CRUXIDE creates a review guide and links to the provider's source.

The recommended rule packs include architecture, security, testing, performance, accessibility, APIs, AI work, ESLint, and Git workflow. Rules are optional and can be extended or overridden by project instructions. Git workflow guidance uses `feat/`, `fix/`, `docs/`, `style/`, `refactor/`, `test/`, `chore/`, `perf/`, `ci/`, and `build/` branch prefixes and Conventional Commits. CRUXIDE never edits `package.json`, installs packages, creates Git hooks, or adds files to the application bundle without explicit developer action.

## Build and verify

Requirements: Node.js 22 and npm 11.

```bash
npm ci
npm run verify
npm run package:release
```

`npm run verify` runs strict TypeScript checks, ESLint, tests, a high-severity dependency audit, and npm registry signature verification. `npm run package:release` additionally validates every curated ID against the Visual Studio Marketplace and produces `release/CRUXIDE-v1.0.0.zip` with the installers, VSIX, skills catalog, checksums, fonts, icon, and complete source.

## Security and privacy

See the packaged `SECURITY.md`, `PRIVACY.md`, and `THREAT_MODEL.md` files.

## Application identity limitation

A VS Code profile cannot replace Microsoft's executable, process identity, top-left product icon, or guaranteed running taskbar icon. The Windows Desktop/Start shortcuts and macOS launcher use the exact CRUX favicon. A fully independent binary/taskbar identity requires a separately maintained Code-OSS distribution with the applicable product configuration and trademarks.
