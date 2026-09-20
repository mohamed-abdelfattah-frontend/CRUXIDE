# Changelog

All notable changes follow Keep a Changelog conventions.

## Unreleased

## 1.0.0 - 2026-09-20

The first public release of CRUXIDE.

Earlier 1.0.0, 1.0.1, 1.1.0 and 1.2.0 entries were internal iterations that
were never published. Their work ships together here, so it is recorded as one
release rather than as a history that users never received.

### Track-based setup

- Consent-based first-run **CRUXIDE Setup** with 26 selectable development
  tracks, all selected by default and reducible before anything is installed.
- 87 curated editor integrations, deduplicated across tracks, installed only
  when missing. Existing extensions are preserved and never downgraded.
- Platform filtering, prerequisite disclosure, and a generated extension and
  track reference.
- Frontend, native mobile, backend, Python and AI, data, DevOps, design,
  collaboration, testing, and agent and review tracks.

### Databases and data access

- Independently selectable SQL/relational, NoSQL, and ORM/data-access tracks.
- Official MongoDB, Redis, Prisma, and SQLTools SQLite tooling.
- Skills and version-aware rules for NoSQL architecture, ORM data access, and
  Sequelize models, associations, transactions, migrations, security, and query
  performance, covering Sequelize, Prisma, TypeORM, Mongoose, EF Core,
  Hibernate/JPA, SQLAlchemy, Django ORM, and Eloquent, without requiring any
  application runtime dependency.

### Skills and rules

- 124 skills and rule packs: 84 skills and 40 rule packs, as plain Markdown
  with no executable hooks.
- Agent adapters for Codex, Claude Code, GitHub Copilot, Cursor, Gemini, and
  generic skill-aware agents.
- Project Local, Project Shared, and User Global scopes, with Guidance,
  Warning, Strict, and Custom rule modes.
- Generated `.crux/PROJECT_RULES.md` with a preserved **Custom Project Rules**
  section, a root pointer, and managed agent instructions.
- Version-aware technology rule packs that inspect the repository's actual
  framework and toolchain versions before applying guidance.
- Independently composable **WCAG 2.2**, **BITV 2.0**, and **BFSG**
  accessibility packs.
- `/crux-conductor`, an explicitly invoked orchestration skill for supported
  external AI agents.

### Experience

- CRUXIDE Dark and Light themes, CRUXIDE Home, the CRUXIDE Activity Bar, the
  Skills Manager, and TypeScript and TSX snippets.
- Confirmed setup applies the CRUXIDE experience automatically. A setting that
  cannot be written is reported rather than counted as success, and
  `CRUXIDE: Apply CRUXIDE Experience` reapplies it idempotently at any time.
- Track selection preserves scroll position, keyboard focus, and selected
  state.
- Windows Desktop and Start Menu launchers and a macOS `CRUXIDE.app` launcher.

### Privacy and security

- No analytics, telemetry, crash reporting, or background network requests from
  the extension host.
- Restrictive webview Content Security Policy, local-only webview assets, and
  validated webview messages.
- Workspace Trust respected for every project-scoped write.
- No runtime, SDK, package, database server, or Git hook is installed, and no
  project manifest is modified.
