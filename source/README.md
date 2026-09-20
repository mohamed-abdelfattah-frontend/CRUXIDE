<p align="center">
  <img src="https://raw.githubusercontent.com/mohamed-abdelfattah-frontend/CRUXIDE/main/source/media/crux-logo.png" width="96" alt="CRUXIDE" />
</p>

<h1 align="center">CRUXIDE</h1>

<p align="center"><strong>Your stack. Your standards. One developer experience.</strong></p>

<p align="center">
  <a href="https://www.cruxcode.dev">CRUXCODE.DEV</a> ·
  <a href="https://github.com/mohamed-abdelfattah-frontend/CRUXIDE">Source</a> ·
  <a href="https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/issues">Report an issue</a>
</p>

---

## The problem

A new project means the same lost afternoon every time. You install the same extensions from memory, half of them the wrong ones. You re-tune the same settings. Then you open an AI assistant and re-explain your architecture, your testing rules, and your security expectations — in every single prompt, in every new session, on every machine.

Extension packs make this worse, not better. They install *everything* for *everyone*, so an Angular developer ends up carrying Flutter tooling and a backend engineer carries three frontend linters.

**CRUXIDE fixes the setup problem and the prompting problem together.** You pick the tracks that match your stack. It prepares exactly the editor tooling those tracks need, and installs the matching engineering guidance where your AI agent will actually read it.

> **Less setup. Less repeated prompting. More consistent engineering.**

---

## What you get

| | |
| --- | --- |
| **26 development tracks** | Pick your stack — nothing you did not choose gets installed |
| **87 curated editor integrations** | Deduplicated, and installed only when actually missing |
| **124 skills and rule packs** | Plain Markdown guidance your AI agent reads — 84 skills, 40 rule packs |
| **6 AI-agent adapters** | Codex · Claude Code · GitHub Copilot · Cursor · Gemini · generic |

Everything is reviewable before anything is written, and nothing installs until you confirm a native VS Code dialog.

---

## Quick start

1. **Install CRUXIDE**, or run `code --install-extension cruxcode.cruxide`.
2. **Setup opens on first run.** Nothing has been installed yet.
3. **Review the tracks.** All 26 start selected — uncheck what this profile does not need.
4. **Confirm the plan** in VS Code's native dialog. This is the point of consent.
5. **Missing tools install.** Anything you already have is skipped and never downgraded.
6. **The CRUXIDE experience applies** — theme, icon theme, window title, monospace font settings, ligatures.
7. **Open the Skills Manager** from Home, the Activity Bar, or the Command Palette.
8. **Choose** skills, rules, scope, rule mode, and your AI agent, then install the guidance.
9. **Invoke `/crux-conductor`** in your agent when a task needs several skills coordinated.

Steps 1–6 configure the editor. Steps 7–9 configure how your AI agent works on the project.

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

Every track declares its extensions, skills, rule packs, and prerequisites up front. Deselecting a track later never uninstalls tools you may still be using. The complete track-to-extension map ships as `EXTENSIONS.md`.

### Databases and data access

Database support is three independently selectable tracks, so a backend engineer is not forced to carry all of it:

- **SQL & Relational** — PostgreSQL, MySQL/MariaDB, SQL Server, SQLite.
- **NoSQL** — MongoDB and Redis, with guidance on document modelling, key design, consistency, TTL, and eviction.
- **ORMs & Data Access** — Prisma tooling, plus guidance for Sequelize, Prisma, TypeORM, Mongoose, EF Core, Hibernate/JPA, SQLAlchemy, Django ORM, and Eloquent.

CRUXIDE installs **editor tooling only**. Database servers, drivers, ORM packages, migration CLIs, and credentials stay entirely under your control.

### Quality, accessibility, and delivery

Testing and quality guidance, Git branch and Conventional Commit conventions, containers and CI/CD, documentation and design, and code review standards are all available as tracks with their own rule packs.

Accessibility ships as three independent, composable packs — **WCAG 2.2**, **BITV 2.0**, and **BFSG**. Use one, two, or all three. Automated scans are never treated as sufficient for a formal conformance claim.

---

## What installs, and what never does

**Installs, only after you confirm:** VS Code extensions for the tracks you selected, into the active profile · CRUXIDE's own theme, editor and terminal font *settings*, and window title · Markdown skill and rule files in the scope you chose.

**On fonts:** CRUXIDE sets the editor and terminal font to `'Roboto Mono', Consolas, 'Courier New', monospace`. It does **not** install the Roboto Mono font file — a Marketplace or VSIX install changes settings only. If Roboto Mono is not already on your system you will see the next font in that fallback list, which is harmless. The Windows and macOS installers in the GitHub release do install the font.

**Never installs:** language runtimes or SDKs (Node.js, Python, PHP, Composer, JDK, .NET, Go, Rust, Flutter, Android SDK, Swift, Xcode) · database servers · application dependencies or ORM packages · Git hooks · credentials.

CRUXIDE does not modify `package.json` or any project manifest.

---

## Skills, rules, and the Skills Manager

Selected tracks already include their mapped skills and rules. Open **CRUXIDE: Skills Manager** when you want finer control: search and filter the catalog, read the README for any entry, add or remove individual skills, choose target agents, copy an agent prompt or an installation plan, and review everything before a single file is written.

Choose where the files live:

- **Project Local** *(default)* — canonical files in `.crux`, kept private through a managed block in `.git/info/exclude`. Your repository's shared `.gitignore` is never modified.
- **Project Shared** — the same files, prepared for team review and commit.
- **User Global** — canonical skills under `~/.cruxide`, plus small adapter files for your selected agents.

Rule packs run in **Guidance**, **Warning**, **Strict**, or **Custom** mode. A confirmed project install generates `.crux/PROJECT_RULES.md` and preserves its **Custom Project Rules** section on regeneration. Existing project-authored files are backed up, and anything outside CRUXIDE-managed blocks is left alone.

Every technology rule pack is version-aware: the agent inspects your repository's actual framework and toolchain versions before applying guidance, and proposes migrations separately with rollback notes.

### `/crux-conductor`

`/crux-conductor` is a **skill you invoke explicitly** inside a supported AI agent. It reads your prompt, recommends and orders the relevant installed skills, flags conflicts between them, and coordinates the expected outputs. Where your agent supports delegation, it can structure that delegation.

It is **not** a built-in AI model, a background agent, an autonomous runtime, or a replacement for Codex, Claude Code, Copilot, Cursor, or Gemini. It never activates itself.

### External providers

Catalog entries for provider-managed tools such as Archify, CodeRabbit, Trail of Bits, Superpowers, and Context7 are **never downloaded or executed**. CRUXIDE writes a review guide and links to the provider's own source so you decide whether to adopt them.

---

## Privacy and security

CRUXIDE collects nothing. **No analytics, no telemetry, no crash reporting.** It does not read or transmit your workspace contents, filenames, credentials, or personal information, and the extension host makes no background network requests.

- Webviews load only local assets under a restrictive Content Security Policy.
- Every webview message is validated against a fixed allowlist.
- No workspace code execution and no extension-host child processes.
- Extension downloads go through VS Code's own Marketplace client, for the extensions you confirmed.

**Workspace Trust.** Project-scoped writes respect VS Code Workspace Trust. Without a trusted local folder, extension setup still proceeds and project skills are safely deferred until you open and trust a workspace.

Full policies ship with the extension as `SECURITY.md`, `PRIVACY.md`, and `THREAT_MODEL.md`.

---

## Commands and settings

`CRUXIDE: Open Home` · `Setup & Manage Tracks` · `Skills Manager` · `Apply CRUXIDE Experience` · `Open Project Folder` · `New Code File` · `Manage Developer Tools`

`cruxide.openHomeOnEmpty` · `cruxide.promptToOpenSetupOnFirstRun` · `cruxide.codeFileExtensions`

Setup applies the CRUXIDE experience automatically once you confirm. **CRUXIDE: Apply CRUXIDE Experience** reapplies it at any time — it is idempotent and writes only the settings CRUXIDE owns.

---

## Supported editors and limitations

- **Visual Studio Code** — supported, and the editor CRUXIDE is built and tested against.
- **Cursor** — the same VSIX installs manually through **Extensions → Install from VSIX…**. Tracks, themes, Skills Manager, and `.crux` output behave the same. CRUXIDE is **not** published on the Cursor Marketplace, and skills are guidance files Cursor's agent reads — CRUXIDE does not drive Cursor's AI directly.
- **JetBrains / WebStorm** — not supported. It would require a separate signed IntelliJ Platform plugin.

**Known limitations, stated plainly:**

- CRUXIDE configures the **active** VS Code profile. A VS Code extension cannot create or switch profiles for you. If you want CRUXIDE isolated, run **Profiles: Create Profile**, switch to it, then run setup.
- A VS Code extension cannot replace Microsoft's executable, process identity, or taskbar icon. The Windows and macOS launchers use the CRUX icon; a fully independent application identity would require a separately maintained Code-OSS distribution.
- Skills and rules are guidance your AI agent reads. CRUXIDE does not execute them, and it cannot force an agent to follow them.

---

## Uninstalling

Uninstall CRUXIDE from the Extensions view like any other extension.

CRUXIDE does not remove things behind your back, so a few items are left for you to decide on:

- **Extensions installed from tracks stay installed.** They are ordinary extensions you confirmed, and other work may depend on them. Remove any you no longer want from the Extensions view.
- **Settings CRUXIDE applied stay applied.** Reset `workbench.colorTheme`, `workbench.iconTheme`, `window.title`, `editor.fontFamily`, `editor.fontLigatures`, and `terminal.integrated.fontFamily` in Settings if you want your previous values back.
- **Project files stay in place.** Delete the `.crux` folder and the managed block in `.git/info/exclude` to remove project-local skills and rules. For User Global scope, remove `~/.cruxide`.

---

## Build and verify

Node.js 22 and npm 11.

```bash
npm ci
npm run verify        # typecheck, lint, tests, high-severity audit, signature verification
npm run smoke:test    # activates the extension in a real VS Code Extension Host
npm run package:release
```

`package:release` validates every curated extension ID against the live Marketplace, then produces the VSIX, the release archive, installers, checksums, fonts, and icon. Release maintainers follow `PUBLISHING.md`; Marketplace publication is deliberately separate from build and release creation, so only a checksum-verified release asset is ever published.

---

<p align="center">
  <strong>AI writes the code. You set the rules.</strong><br />
  <a href="https://www.cruxcode.dev">www.cruxcode.dev</a>
</p>
