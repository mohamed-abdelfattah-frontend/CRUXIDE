# CRUXIDE

**Your stack. Your standards. One developer experience.**

CRUXIDE turns Visual Studio Code into a focused, track-based engineering workspace for modern development and AI-assisted delivery.

Choose the technologies you actually use. CRUXIDE prepares the relevant editor tooling, AI skills, engineering rules, and review guidance — without forcing every framework into the same profile.

> **Less setup. Less repeated prompting. More consistent engineering.**

[CRUXCODE.DEV](https://www.cruxcode.dev) · [Source](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE) · [Report an issue](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/issues)

---

## What you get

| In this release | |
| --- | --- |
| **26 tracks** | Frontend, mobile, backend, AI, data, platform, and productivity |
| **87 editor integrations** | Curated, deduplicated, installed only when missing |
| **124 skills and rule packs** | 84 skills and 40 rule packs as plain Markdown |
| **6 agent adapters** | Codex, Claude Code, GitHub Copilot, Cursor, Gemini, generic |

CRUXIDE is not an extension pack that installs everything. You pick the tracks; it prepares only what those tracks need.

---

## Your first ten minutes

1. **Install CRUXIDE** from the Marketplace, or from a VSIX (see below).
2. **Setup opens on first run.** Nothing has been installed yet.
3. **Review the tracks.** All 26 start selected — uncheck whatever this profile does not need.
4. **Confirm the plan** in VS Code's native dialog. This is the point of consent; nothing is written before it.
5. **Missing tools are installed.** Extensions you already have are skipped and never downgraded.
6. **The CRUXIDE experience is applied automatically** — theme, icon theme, window title, Roboto Mono, ligatures.
7. **Open the Skills Manager** from CRUXIDE Home, the Activity Bar, or the Command Palette.
8. **Select** skills, rules, scope, rule mode, and your AI agent.
9. **Install the selected guidance.** Project writes require a trusted local workspace.
10. **Invoke `/crux-conductor`** in your AI agent when a task needs several skills coordinated.

Steps 1–6 configure the editor. Steps 7–10 configure how your AI agent works on the project.

---

## Installation

### From the Marketplace

Install **CRUXIDE** from the Extensions view, or:

```bash
code --install-extension cruxcode.cruxide
```

### From a release VSIX

Download the versioned `CRUXIDE-v1.2.0.zip` from [GitHub Releases](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/releases). Do not use GitHub's **Code → Download ZIP**; that is a source archive and does not contain the release-built VSIX.

**Windows** — extract the ZIP, open PowerShell in the folder, and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\install-windows.ps1
```

**macOS** — run **Shell Command: Install 'code' command in PATH** once in VS Code, then:

```bash
chmod +x ./install-macos.sh
./install-macos.sh
```

**Manual** — `code --install-extension ./cruxide-1.2.0.vsix --force`, or **Extensions → More Actions → Install from VSIX…**.

The installers verify the VSIX, icon, and font SHA-256 checksums before installing, and install Roboto Mono per-user. Track tools are chosen later, inside CRUXIDE, with explicit consent.

### Which profile CRUXIDE configures

CRUXIDE applies to the **active VS Code profile**. It does not create or switch profiles for you — a VS Code extension cannot.

If you want CRUXIDE isolated from your existing setup, create the profile **before** running setup: **Profiles: Create Profile**, switch to it, then run **CRUXIDE: Setup & Manage Tracks**. Setup offers a shortcut to the Profiles manager for exactly this.

---

## Tracks

| Area | Tracks |
| --- | --- |
| **Core** | CRUX Core · Quality & Testing · Accessibility Standards |
| **Frontend** | Frontend Shared · Angular · React · Next.js |
| **Mobile** | React Native & Expo · Android & Kotlin · iOS & Swift · Flutter & Dart |
| **Backend** | Node.js · Express · NestJS · PHP & Laravel · .NET & ASP.NET Core · Java & Spring Boot · Go & Rust |
| **AI & Data** | Python, AI & Data Science · SQL & Relational Databases · NoSQL Databases · ORMs & Data Access · AI Agents & Code Review |
| **Platform** | Containers & DevOps · Git & Collaboration |
| **Productivity** | Design & Documentation |

Every track declares its extensions, skills, rule packs, and prerequisites up front. Deselecting a track later never uninstalls tools you may still be using. See `EXTENSIONS.md` for the complete track-to-extension map.

### Databases and ORMs

Database guidance is split across three independently selectable tracks:

- **SQL & Relational Databases** — PostgreSQL, MySQL/MariaDB, SQL Server, SQLite.
- **NoSQL Databases** — MongoDB and Redis, with guidance on document modelling, key design, consistency, TTL, and eviction.
- **ORMs & Data Access** — Prisma tooling, plus skills and rules covering Sequelize, Prisma, TypeORM, Mongoose, EF Core, Hibernate/JPA, SQLAlchemy, Django ORM, and Eloquent.

CRUXIDE installs **editor tooling only**. Database servers, drivers, ORM runtime packages, migration CLIs, and credentials stay under your control.

---

## What CRUXIDE installs — and what it never installs

**Installs, after your confirmation:** VS Code extensions for the tracks you selected, into the active profile; CRUXIDE's own theme, fonts, and window title; Markdown skill and rule files in the scope you chose.

**Never installs:** language runtimes or SDKs (Node.js, Python, PHP, Composer, JDK, .NET, Go, Rust, Flutter, Android SDK, Swift, Xcode) · database servers · application dependencies or ORM packages · Git hooks · credentials. It does not modify `package.json` or any project manifest.

---

## CRUX Skills and the Skills Manager

Selected tracks already include their mapped skills and rules. Open **CRUXIDE: Skills Manager** — from Home, the Activity Bar, or the Command Palette — when you want finer control: search and filter the catalog, read the README for any entry, add or remove individual skills, pick target agents, copy an agent prompt or an installation plan, and review everything before any file is written.

Choose where the files live:

- **Project Local** *(default)* — canonical files in `.crux`, kept private through a managed block in `.git/info/exclude`. Your repository's shared `.gitignore` is never modified.
- **Project Shared** — the same files, prepared for team review and commit.
- **User Global** — canonical skills under `~/.cruxide`, plus small adapter files for the agents you selected.

Project-scoped writes respect VS Code Workspace Trust. Without a trusted local folder, extension setup still proceeds and project skills are deferred until you open and trust a workspace.

Rule packs run in **Guidance**, **Warning**, **Strict**, or **Custom** mode. Confirmed project installs generate `.crux/PROJECT_RULES.md` and preserve its **Custom Project Rules** section on regeneration. Existing project-authored files are backed up, and content outside CRUXIDE-managed blocks is left alone.

Accessibility is covered by three independent, composable packs — **WCAG 2.2**, **BITV 2.0**, and **BFSG**. Use one, two, or all three. Automated scans are never sufficient for a formal conformance claim.

Every technology rule pack is version-aware: the agent inspects your repository's actual framework and toolchain versions before applying guidance, and proposes migrations separately with rollback notes.

### CRUX Conductor

`/crux-conductor` is a **skill you invoke explicitly** inside a supported AI agent. It reads your prompt, recommends and orders the relevant installed skills, flags conflicts, and coordinates the expected outputs. Where your agent supports delegation, it can structure that delegation.

It is not a built-in AI model, a background agent, an autonomous runtime, or a replacement for Codex, Claude Code, Copilot, Cursor, or Gemini. It never activates itself.

### External providers

Provider-managed entries such as Archify, CodeRabbit, Trail of Bits, Superpowers, and Context7 are **never downloaded or executed**. CRUXIDE writes a review guide and links to the provider's own source, so you decide whether to adopt them.

---

## Privacy

CRUXIDE collects nothing. No analytics, no telemetry, no crash reporting. It does not read or transmit your workspace contents, filenames, credentials, or personal information, and the extension host makes no background network requests.

Webviews load only local assets under a restrictive Content Security Policy, every webview message is validated against a fixed allowlist, and there is no workspace code execution and no extension-host child process.

Extension downloads go through VS Code's own Marketplace client, for the extensions you confirmed. See `PRIVACY.md`, `SECURITY.md`, and `THREAT_MODEL.md`.

---

## Commands and settings

`CRUXIDE: Open Home` · `Setup & Manage Tracks` · `Skills Manager` · `Apply CRUXIDE Experience` · `Open Project Folder` · `New Code File` · `Manage Developer Tools`

`cruxide.openHomeOnEmpty` · `cruxide.promptToOpenSetupOnFirstRun` · `cruxide.codeFileExtensions`

Setup applies the CRUXIDE experience automatically once you confirm. **CRUXIDE: Apply CRUXIDE Experience** reapplies it at any time — it is idempotent and writes only the settings CRUXIDE owns.

---

## Editor support

- **Visual Studio Code** — supported and published to the Marketplace.
- **Cursor** — the same VSIX installs manually via **Extensions → Install from VSIX…**. Tracks, themes, Skills Manager, and `.crux` output behave the same. CRUXIDE is **not** published on the Cursor Marketplace, and skills are guidance files Cursor's agent reads — CRUXIDE does not drive Cursor's AI directly.
- **JetBrains / WebStorm** — not produced by this repository; it would require a separate signed IntelliJ Platform plugin.

A VS Code extension cannot replace Microsoft's executable, process identity, or taskbar icon. The Windows and macOS launchers use the CRUX icon; a fully independent application identity would require a separately maintained Code-OSS distribution.

---

## Build and verify

Node.js 22 and npm 11.

```bash
npm ci
npm run verify        # typecheck, lint, tests, high-severity audit, signature verification
npm run smoke:test    # activates the extension in a real VS Code Extension Host
npm run package:release
```

`package:release` validates every curated extension ID against the Marketplace and produces `release/CRUXIDE-v1.2.0.zip` with the installers, VSIX, skills catalog, checksums, fonts, and icon. Maintainers follow [PUBLISHING.md](PUBLISHING.md); Marketplace publication is deliberately separate from build and release creation.

---

## CRUXIDE by CRUXCODE.DEV

CRUX means the essential point — the part of a problem that matters most.

> **AI writes the code. You set the rules.**

[www.cruxcode.dev](https://www.cruxcode.dev)
