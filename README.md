# CRUXIDE

## Your stack. Your standards. One developer experience.

CRUXIDE turns Visual Studio Code into a focused, track-based engineering workspace built for modern development and AI-assisted delivery.

Choose the technologies you actually use. CRUXIDE prepares the relevant editor tooling, AI skills, engineering rules, and review guidance—without forcing every framework, extension, or workflow into the same profile.

Whether you build frontend applications, native mobile experiences, backend services, AI systems, data platforms, or cloud infrastructure, CRUXIDE helps you start with the right environment and keep your AI coding agents aligned with the way your project should be engineered.

> **Less setup. Less repeated prompting. More consistent engineering.**

[Download the latest release](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/releases) · [View the source](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE) · [Visit CRUXCODE](https://www.cruxcode.dev)

---

## Why CRUXIDE?

AI can generate code quickly. That does not automatically make the code secure, maintainable, testable, or suitable for your architecture.

CRUXIDE brings five parts of the development experience together:

- **Tooling** — curated VS Code extensions based on your selected tracks.
- **Skills** — portable capabilities for supported AI coding agents.
- **Rules** — practical engineering guidance for architecture, security, testing, accessibility, Git, and code quality.
- **Code Review** — structured review guidance covering correctness, maintainability, performance, security, and project standards.
- **Orchestration** — CRUX Conductor can identify and coordinate the relevant installed skills for a task when invoked explicitly.

CRUXIDE is not another extension pack that installs everything. It builds a profile around the way you work.

---

## Choose your tracks

On first launch, CRUXIDE opens a guided setup experience. Select only the tracks you need, review the generated plan, and confirm before anything is installed.

Supported areas include:

- **Frontend:** Angular, React, Next.js, React Native, Tailwind CSS, and shadcn/ui.
- **Mobile:** Android, Kotlin, Jetpack Compose, iOS, Swift, SwiftUI, Flutter, and Dart.
- **Backend:** Node.js, Express, NestJS, PHP, Laravel, .NET, ASP.NET Core, Java, Spring Boot, Go, and Rust.
- **AI & Data:** Python, AI engineering, RAG, agent workflows, data science, notebooks, SQL/relational databases, MongoDB, Redis, and ORM/data-access workflows.
- **Engineering:** architecture, security, testing, accessibility, DevOps, containers, Git/GitHub, documentation, design, and collaboration.

CRUXIDE checks the selected track plan, skips tools that are already available, and installs only the missing editor integrations after your confirmation.

It does **not** silently install language runtimes, SDKs, project packages, Git hooks, or application dependencies.

---

## AI agents that understand your engineering standards

CRUX Skills provide reusable Markdown-based instructions for:

- solution and software architecture;
- frontend, mobile, backend, AI, and data engineering;
- secure coding and security review;
- testing and browser automation;
- code review and maintainability;
- performance and accessibility;
- ESLint and engineering conventions;
- Git branches and Conventional Commits;
- planning, documentation, context, and agent workflows.

Agent adapters are available for:

- Codex;
- Claude Code;
- GitHub Copilot;
- Cursor;
- Gemini;
- generic skill-aware agents.

Instead of repeating the same project expectations in every prompt, you can install the relevant guidance once and let the agent reference a consistent source of truth.

### CRUX Conductor

When you are unsure which skills a task needs, invoke:

```text
/crux-conductor
```

CRUX Conductor analyzes the request, selects the relevant installed skills, orders their work, detects obvious conflicts, and coordinates the result. In environments that support delegation, it can structure work across specialized agents while keeping one coordinated outcome.

> **One prompt. The right skills. One coordinated result.**

CRUX Conductor is explicit-only. It does not activate itself or silently change how your agent handles a request.

---

## Track-based setup and advanced skill control

Selected tracks automatically include their mapped skills and rule packs. Most developers can configure everything from **CRUXIDE: Setup & Manage Tracks**.

Use **CRUXIDE: Skills Manager** when you want advanced control:

- add or remove individual skills independently of a track;
- inspect the README for every skill or rule pack;
- choose one or more target agents;
- install at project or user scope;
- generate an installation guide for manual review;
- manage recommended and custom selections.

Provider-managed integrations—including Archify, CodeRabbit, Trail of Bits, Superpowers, and Context7—are never downloaded or executed silently. CRUXIDE provides review documentation and links to the original provider source.

---

## Project rules that remain yours

CRUXIDE can generate a canonical `.crux/PROJECT_RULES.md` from the selected rule packs.

The generated guidance can cover:

- architecture and dependency boundaries;
- security and secure API integration;
- testing strategy and quality gates;
- performance and maintainability;
- accessibility standards;
- naming and code conventions;
- branch naming and commit standards;
- technology-specific practices.

Database guidance is independently selectable across **SQL & Relational Databases**, **NoSQL Databases**, and **ORMs & Data Access**. It includes official editor tooling for PostgreSQL, MySQL/MariaDB, SQL Server, SQLite, MongoDB, Redis, and Prisma, plus production-grade skills and rules for Sequelize, Prisma, TypeORM, Mongoose, EF Core, Hibernate/JPA, SQLAlchemy, Django ORM, and Eloquent. CRUXIDE installs editor tooling only; your application runtime packages and database credentials remain under project control.

Rules are not a locked policy engine. You can use them as provided, adjust them for your project, extend them with team conventions, or add custom code-review instructions. CRUXIDE preserves the **Custom Project Rules** section when regenerating managed content.

Available modes:

- **Guidance** — recommendations for the agent.
- **Warning** — highlight deviations before proceeding.
- **Strict** — request compliance with the selected rules.
- **Custom** — let the project define the behavior.

---

## Accessibility by design

Accessibility guidance is available as independent, composable rule packs:

- **WCAG 2.2**;
- **BITV 2.0**;
- **BFSG**.

Use one standard, combine two, or apply all three. CRUXIDE keeps their requirements explicit and never treats automated scans as proof of legal or formal conformance. Qualified human review remains essential.

---

## A clean project by default

Choose where CRUX Skills and rules should live:

- **Project Local** — stores files in `.crux` and keeps them private through a managed `.git/info/exclude` block.
- **Project Shared** — makes portable rules and skills available for team review and commit.
- **User Global** — stores canonical skills under `~/.cruxide` for reuse across projects.

Project Local is the default. CRUXIDE does not modify the repository's shared `.gitignore`, package manifests, or application dependencies.

If no trusted local folder is open, extension setup can continue, but project skills and rules are deferred until you open and trust a workspace.

---

## Built for trust

CRUXIDE is designed to be inspectable and consent-based:

- no telemetry;
- no background network requests from the extension host;
- no workspace code execution;
- no extension-host child processes;
- no silent runtime, SDK, package, or Git-hook installation;
- local webview assets with a restrictive Content Security Policy;
- validated messages and restricted resource roots;
- checksum-verified release assets;
- existing extensions are preserved and never intentionally downgraded;
- your normal VS Code profile is not replaced.

See `SECURITY.md`, `PRIVACY.md`, and `THREAT_MODEL.md` for the complete policies.

---

## Quick start

> Download the versioned ZIP from [GitHub Releases](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/releases). Do not use GitHub's **Code → Download ZIP** source archive; it does not contain the release-built VSIX.

### Windows

Extract `CRUXIDE-v1.1.0.zip`, open PowerShell inside the extracted folder, and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\install-windows.ps1
```

Start **CRUXIDE** from the Desktop or Start Menu shortcut.

### macOS

In VS Code, first run **Shell Command: Install 'code' command in PATH**. Extract `CRUXIDE-v1.1.0.zip`, open Terminal inside the folder, and run:

```bash
chmod +x ./install-macos.sh
./install-macos.sh
```

CRUXIDE creates a user-level `~/Applications/CRUXIDE.app` launcher.

### Install the VSIX manually

```bash
code --profile "CRUXIDE" --new-window
code --profile "CRUXIDE" --install-extension ./cruxide-1.1.0.vsix --force
code --profile "CRUXIDE" --new-window
```

You can also use **Extensions → More Actions → Install from VSIX…**.

---

## First launch

CRUXIDE Setup opens on the first launch. Review the tracks, target profile, AI agents, skill scope, and rules mode before applying the setup.

After confirmation, CRUXIDE can configure:

- CRUXIDE Dark or Light theme;
- Material Icon Theme;
- CRUX-branded window title;
- Roboto Mono for the editor and terminal;
- editor font ligatures;
- selected track integrations;
- mapped AI skills and project rules.

Nothing is installed until you approve the native VS Code confirmation dialog.

---

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

---

## For contributors

Requirements: Node.js 22 and npm 11.

```bash
npm ci
npm run verify
npm run smoke:test
npm run package:release
```

`npm run verify` runs TypeScript checks, ESLint, tests, a high-severity dependency audit, and npm registry signature verification.

`npm run smoke:test` activates CRUXIDE in a real VS Code Extension Host.

`npm run package:release` validates curated Marketplace IDs and creates the release ZIP, VSIX, installers, checksums, fonts, icon, skills catalog, and source package.

Release maintainers should follow [`PUBLISHING.md`](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/blob/main/PUBLISHING.md).

---

## Platform scope

- **Visual Studio Code:** supported through the VSIX and Marketplace release workflow.
- **Cursor:** manual VSIX compatibility testing is required before making a public compatibility claim.
- **WebStorm:** requires a separate signed IntelliJ Platform plugin and is not produced by this repository.

A VS Code profile cannot replace Microsoft's executable identity, process name, top-left application icon, or guaranteed running taskbar icon. CRUXIDE launchers use the CRUX favicon, while a completely independent application identity would require a separately maintained Code-OSS distribution.

---

## CRUXIDE by CRUXCODE

CRUX means the essential point—the part of a problem that matters most.

CRUXIDE applies that idea to software development: the goal is not to add more tools, prompts, or complexity. The goal is to give every project the right environment, the right guidance, and a stronger engineering foundation.

> **AI writes the code. You set the rules.**

[www.cruxcode.dev](https://www.cruxcode.dev)
