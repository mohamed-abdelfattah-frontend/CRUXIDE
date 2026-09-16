# CRUXIDE track-based developer tools

CRUXIDE does not install one fixed extension pack. On first activation, **CRUXIDE Setup** presents every track as selected by default. The developer can uncheck tracks, review the resulting plan, choose agents and rules scope, and approve installation. The same screen can add tracks later.

The IDs below are fixed in `src/tracks-catalog.ts` and validated against the Visual Studio Marketplace during release. Binaries are downloaded by VS Code and are never embedded or republished by CRUXIDE. Existing extensions are preserved, platform-incompatible entries are skipped, and CRUXIDE never intentionally downgrades or silently uninstalls a tool.

CRUXIDE installs editor integrations only. It does not install language runtimes, compilers, SDKs, project packages, Git hooks, database servers, emulators, or provider credentials.

## CRUX Core (required)

Profile essentials, portable project guidance, spelling, YAML, Markdown, and the CRUX visual experience.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `editorconfig.editorconfig` | EditorConfig | Windows, macOS, Linux |  |
| `streetsidesoftware.code-spell-checker` | Code Spell Checker | Windows, macOS, Linux |  |
| `redhat.vscode-yaml` | YAML | Windows, macOS, Linux |  |
| `davidanson.vscode-markdownlint` | markdownlint | Windows, macOS, Linux |  |
| `aaron-bond.better-comments` | Better Comments | Windows, macOS, Linux |  |
| `nhoizey.gremlins` | Gremlins | Windows, macOS, Linux |  |
| `pkief.material-icon-theme` | Material Icon Theme | Windows, macOS, Linux |  |

**Mapped skills:** `crux-conductor`, `crux-architecture-guardrails`, `crux-solution-architecture`, `crux-planning-adr`, `crux-testing-strategy`, `crux-performance-audit`, `crux-documentation`, `crux-secure-coding`, `crux-threat-modeling`, `crux-secrets-dependency-audit`

**Mapped rules:** `crux-base-quality-rules`, `crux-clean-architecture-rules`, `crux-git-workflow-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-solution-architecture-rules`, `crux-technical-lead-rules`

**Prerequisites**

- No additional runtime prerequisite declared.

## Quality & Testing

Formatting, linting, browser testing, code metrics, TODOs, and focused developer utilities.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `dbaeumer.vscode-eslint` | ESLint | Windows, macOS, Linux |  |
| `esbenp.prettier-vscode` | Prettier | Windows, macOS, Linux |  |
| `stylelint.vscode-stylelint` | Stylelint | Windows, macOS, Linux |  |
| `ms-playwright.playwright` | Playwright Test | Windows, macOS, Linux |  |
| `alefragnani.separators` | Separators | Windows, macOS, Linux |  |
| `cpmcgrath.codealignment-vscode` | Code Alignment | Windows, macOS, Linux |  |
| `kisstkondoros.vscode-codemetrics` | CodeMetrics | Windows, macOS, Linux |  |
| `bracketpaircolordlw.bracket-pair-color-dlw` | Bracket Pair Color DLW | Windows, macOS, Linux |  |
| `wayou.vscode-todo-highlight` | TODO Highlight | Windows, macOS, Linux |  |
| `gruntfuggly.todo-tree` | Todo Tree | Windows, macOS, Linux |  |

**Mapped skills:** `crux-testing-strategy`, `crux-review-standard`, `playwright-web-testing`

**Mapped rules:** `crux-eslint-rules`, `crux-testing-rules`, `crux-performance-rules`

**Prerequisites**

- No additional runtime prerequisite declared.

## Accessibility Standards

Independent WCAG 2.2, BITV 2.0, and BFSG rule packs that can be installed alone, in any pair, or together.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| — | No extension | — | — |

**Mapped skills:** `crux-accessibility-i18n`

**Mapped rules:** `crux-accessibility-rules`, `crux-wcag-22-rules`, `crux-bitv-20-rules`, `crux-bfsg-rules`

**Prerequisites**

- Qualified human accessibility and legal review is required for formal conformance or statutory compliance claims

## Frontend Shared

Shared HTML, CSS, SCSS, Tailwind, shadcn/ui, imports, paths, snippets, and design-system tooling.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `bradlc.vscode-tailwindcss` | Tailwind CSS IntelliSense | Windows, macOS, Linux |  |
| `suhelmakkad.shadcn-ui` | shadcn/ui | Windows, macOS, Linux |  |
| `anbuselvanrocky.bootstrap5-vscode` | Bootstrap 5 Snippets | Windows, macOS, Linux |  |
| `p-de-jong.vscode-html-scss` | HTML SCSS Support | Windows, macOS, Linux |  |
| `mrmlnc.vscode-scss` | SCSS IntelliSense | Windows, macOS, Linux |  |
| `xabikos.javascriptsnippets` | JavaScript ES6 Snippets | Windows, macOS, Linux |  |
| `steoates.autoimport` | Auto Import | Windows, macOS, Linux |  |
| `formulahendry.auto-rename-tag` | Auto Rename Tag | Windows, macOS, Linux |  |
| `naumovs.color-highlight` | Color Highlight | Windows, macOS, Linux |  |
| `christian-kohler.npm-intellisense` | npm Intellisense | Windows, macOS, Linux |  |
| `christian-kohler.path-intellisense` | Path Intellisense | Windows, macOS, Linux |  |

**Mapped skills:** `crux-frontend-architecture`, `crux-tailwind-shadcn`, `crux-design-system`, `crux-accessibility-i18n`, `frontend-design`, `web-design-guidelines`, `building-components`, `build-web-apps`

**Mapped rules:** `crux-accessibility-rules`, `crux-performance-rules`, `crux-web-platform-rules`, `crux-typescript-javascript-rules`

**Prerequisites**

- No additional runtime prerequisite declared.

## Angular

Official Angular language tooling plus Angular-oriented snippets and architecture guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `angular.ng-template` | Angular Language Service | Windows, macOS, Linux |  |
| `johnpapa.angular2` | Angular Snippets | Windows, macOS, Linux |  |

**Mapped skills:** `crux-angular-architecture`

**Mapped rules:** `crux-eslint-rules`, `crux-typescript-javascript-rules`, `crux-angular-rules`

**Prerequisites**

- Node.js and the Angular CLI used by the project

## React

React snippets, composition patterns, architecture, testing, and production best practices.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `dsznajder.es7-react-js-snippets` | ES7+ React/Redux/React-Native Snippets | Windows, macOS, Linux |  |

**Mapped skills:** `crux-react-architecture`, `vercel-react-best-practices`, `vercel-composition-patterns`

**Mapped rules:** `crux-eslint-rules`, `crux-typescript-javascript-rules`, `crux-react-rules`

**Prerequisites**

- Node.js and the package manager used by the project

## Next.js

Next.js App Router guidance, snippets, server/client boundaries, and Vercel-maintained practices.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `pulkitgangwar.nextjs-snippets` | Next.js Snippets | Windows, macOS, Linux |  |

**Mapped skills:** `crux-nextjs-architecture`, `vercel-nextjs-best-practices`

**Mapped rules:** `crux-eslint-rules`, `crux-security-rules`, `crux-typescript-javascript-rules`, `crux-react-rules`, `crux-nextjs-rules`

**Prerequisites**

- Node.js supported by the project Next.js version

## React Native & Expo

Microsoft React Native runtime tooling, snippets, native-boundary guidance, and Expo workflows.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `msjsdiag.vscode-react-native` | React Native Tools | Windows, macOS, Linux |  |
| `jundat95.react-native-snippet` | React Native Snippet | Windows, macOS, Linux |  |

**Mapped skills:** `crux-react-native-architecture`, `crux-mobile-quality`, `vercel-react-native-skills`, `expo-development`

**Mapped rules:** `crux-security-rules`, `crux-accessibility-rules`, `crux-typescript-javascript-rules`, `crux-react-rules`, `crux-react-native-rules`

**Prerequisites**

- A working React Native or Expo environment
- Android SDK for Android targets
- macOS and Xcode for iOS targets

## Android & Kotlin

Official JetBrains Kotlin language support with Gradle and CRUX Android/Compose guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `JetBrains.kotlin-server` | Kotlin by JetBrains | Windows, macOS, Linux | Official extension; currently Alpha. |
| `vscjava.vscode-gradle` | Gradle for Java | Windows, macOS, Linux |  |

**Mapped skills:** `crux-android-kotlin`, `crux-mobile-quality`, `test-android-apps`

**Mapped rules:** `crux-security-rules`, `crux-testing-rules`, `crux-accessibility-rules`, `crux-kotlin-android-rules`

**Prerequisites**

- JDK
- Android SDK and platform tools
- Android Studio remains recommended for full Android SDK and device management

## iOS & Swift

Official Swift language tooling plus optional macOS-only Xcode project integration.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `swiftlang.swift-vscode` | Swift for Visual Studio Code | Windows, macOS, Linux |  |
| `sweetpad.sweetpad` | SweetPad | darwin | macOS only; requires Xcode. |

**Mapped skills:** `crux-ios-swift`, `crux-mobile-quality`, `build-ios-apps`

**Mapped rules:** `crux-security-rules`, `crux-testing-rules`, `crux-accessibility-rules`, `crux-swift-ios-rules`

**Prerequisites**

- Swift toolchain
- macOS and Xcode are required for native iOS builds

## Flutter & Dart

Flutter editing, refactoring, run/debug support, Dart dependency, and CRUX mobile architecture.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `Dart-Code.flutter` | Flutter | Windows, macOS, Linux | Installs the Dart extension automatically. |

**Mapped skills:** `crux-flutter-architecture`, `crux-mobile-quality`

**Mapped rules:** `crux-security-rules`, `crux-testing-rules`, `crux-accessibility-rules`, `crux-dart-flutter-rules`

**Prerequisites**

- Flutter SDK available on PATH
- Platform SDKs for the intended targets

## Node.js

Node.js snippets, API workflows, runtime architecture, testing, and production lifecycle guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `chris-noring.node-snippets` | Node Snippets | Windows, macOS, Linux |  |
| `humao.rest-client` | REST Client | Windows, macOS, Linux |  |

**Mapped skills:** `crux-nodejs-architecture`, `crux-api-design`, `crux-backend-testing`, `crux-distributed-systems`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-typescript-javascript-rules`, `crux-nodejs-rules`

**Prerequisites**

- Node.js and the project package manager

## Express

Express snippets and secure middleware, validation, lifecycle, and service-boundary guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `Compulim.vscode-express` | Express | Windows, macOS, Linux |  |

**Mapped skills:** `crux-express-architecture`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-typescript-javascript-rules`, `crux-nodejs-rules`, `crux-express-rules`

**Prerequisites**

- Node.js

## NestJS

NestJS snippets and generators with module, DI, guard, pipe, and interceptor guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `imgildev.vscode-nestjs-snippets-extension` | NestJS Snippets | Windows, macOS, Linux |  |
| `imgildev.vscode-nestjs-generator` | NestJS Generator | Windows, macOS, Linux |  |

**Mapped skills:** `crux-nestjs-architecture`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-typescript-javascript-rules`, `crux-nodejs-rules`, `crux-nestjs-rules`

**Prerequisites**

- Node.js and Nest CLI when required by the project

## PHP & Laravel

PHP language intelligence, the official Laravel extension, debugging, and production backend guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `bmewburn.vscode-intelephense-client` | PHP Intelephense | Windows, macOS, Linux |  |
| `laravel.vscode-laravel` | Laravel | Windows, macOS, Linux |  |
| `xdebug.php-debug` | PHP Debug | Windows, macOS, Linux |  |

**Mapped skills:** `crux-php-architecture`, `crux-laravel-architecture`, `crux-api-design`, `crux-backend-testing`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-php-rules`, `crux-laravel-rules`

**Prerequisites**

- PHP runtime
- Composer
- Xdebug for debugging
- PHP 8.2+ for the official Laravel extension

## .NET & ASP.NET Core

Microsoft C# Dev Kit with .NET/ASP.NET Core architecture, testing, and API guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `ms-dotnettools.csdevkit` | C# Dev Kit | Windows, macOS, Linux | Use is subject to Microsoft licensing terms. |

**Mapped skills:** `crux-dotnet-architecture`, `crux-api-design`, `crux-backend-testing`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-csharp-dotnet-rules`

**Prerequisites**

- A supported .NET SDK

## Java & Spring Boot

Microsoft Java pack and Spring Tools with JVM service architecture and API guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `vscjava.vscode-java-pack` | Extension Pack for Java | Windows, macOS, Linux |  |
| `vmware.vscode-boot-dev-pack` | Spring Boot Extension Pack | Windows, macOS, Linux |  |

**Mapped skills:** `crux-java-spring-architecture`, `crux-api-design`, `crux-backend-testing`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-java-spring-rules`

**Prerequisites**

- A JDK supported by the project
- Maven or Gradle when used by the project

## Go & Rust

Official Go and rust-analyzer language tooling with production service guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `golang.go` | Go | Windows, macOS, Linux |  |
| `rust-lang.rust-analyzer` | rust-analyzer | Windows, macOS, Linux |  |

**Mapped skills:** `crux-go-rust-backend`, `crux-api-design`, `crux-backend-testing`

**Mapped rules:** `crux-api-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-go-rules`, `crux-rust-rules`

**Prerequisites**

- Go toolchain for Go projects
- Rustup and Cargo for Rust projects

## Python, AI & Data Science

Microsoft Python/Jupyter tooling, Ruff, Data Wrangler, and CRUX AI/backend engineering guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `ms-python.python` | Python | Windows, macOS, Linux | Installs supported Python language/debug dependencies. |
| `ms-toolsai.jupyter` | Jupyter | Windows, macOS, Linux |  |
| `charliermarsh.ruff` | Ruff | Windows, macOS, Linux |  |
| `ms-toolsai.datawrangler` | Data Wrangler | Windows, macOS, Linux |  |

**Mapped skills:** `crux-python-ai-engineering`, `crux-python-backend`, `crux-rag-architecture`, `crux-agentic-ai`, `crux-langchain-langgraph`

**Mapped rules:** `crux-ai-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-python-rules`, `crux-ai-rag-production-rules`

**Prerequisites**

- Python runtime and a project environment manager
- Jupyter kernel packages when notebooks are used

## Databases & Data Tools

SQL clients and drivers for common backend data workflows plus database engineering guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `mtxr.sqltools` | SQLTools | Windows, macOS, Linux |  |
| `mtxr.sqltools-driver-pg` | SQLTools PostgreSQL Driver | Windows, macOS, Linux |  |
| `mtxr.sqltools-driver-mysql` | SQLTools MySQL/MariaDB Driver | Windows, macOS, Linux |  |
| `ms-mssql.mssql` | SQL Server (mssql) | Windows, macOS, Linux |  |
| `mechatroner.rainbow-csv` | Rainbow CSV | Windows, macOS, Linux |  |

**Mapped skills:** `crux-database-engineering`, `supabase-postgres-best-practices`

**Mapped rules:** `crux-security-rules`, `crux-performance-rules`, `crux-sql-database-rules`

**Prerequisites**

- Database clients and credentials supplied by the developer

## Containers & DevOps

Containers, dev containers, CI/CD, GitHub Actions, and secure delivery guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `ms-azuretools.vscode-containers` | Container Tools | Windows, macOS, Linux |  |
| `ms-vscode-remote.remote-containers` | Dev Containers | Windows, macOS, Linux |  |
| `github.vscode-github-actions` | GitHub Actions | Windows, macOS, Linux |  |

**Mapped skills:** `crux-docker-containers`, `crux-cicd`, `github-actions`, `turborepo`, `sentry-observability`, `vercel-deployment`, `cloudflare`

**Mapped rules:** `crux-security-rules`, `crux-testing-rules`, `crux-container-cicd-rules`

**Prerequisites**

- Docker or a compatible container runtime when container commands are used

## Git & Collaboration

Pull requests, history, graphing, collaboration, and Git workflow guidance.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `github.vscode-pull-request-github` | GitHub Pull Requests | Windows, macOS, Linux |  |
| `eamodio.gitlens` | GitLens | Windows, macOS, Linux |  |
| `donjayamanne.git-extension-pack` | Git Extension Pack | Windows, macOS, Linux |  |
| `mhutchie.git-graph` | Git Graph | Windows, macOS, Linux |  |
| `donjayamanne.githistory` | Git History | Windows, macOS, Linux |  |
| `ms-vsliveshare.vsliveshare` | Live Share | Windows, macOS, Linux |  |

**Mapped skills:** `github-integration`, `crux-review-standard`

**Mapped rules:** `crux-git-workflow-rules`, `crux-base-quality-rules`

**Prerequisites**

- Git
- Authentication for remote providers when required

## Design & Documentation

Figma integration, previews, diagrams, screenshots, project navigation, and structured documentation tools.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `figma.figma-vscode-extension` | Figma for VS Code | Windows, macOS, Linux |  |
| `quicktype.quicktype` | Paste JSON as Code | Windows, macOS, Linux |  |
| `mariusalchimavicius.json-to-ts` | JSON to TS | Windows, macOS, Linux |  |
| `aykutsarac.jsoncrack-vscode` | JSON Crack | Windows, macOS, Linux |  |
| `alefragnani.project-manager` | Project Manager | Windows, macOS, Linux |  |
| `jmkrivocapich.drawfolderstructure` | Draw Folder Structure | Windows, macOS, Linux |  |
| `adpyke.codesnap` | CodeSnap | Windows, macOS, Linux |  |
| `simonsiefke.svg-preview` | SVG Preview | Windows, macOS, Linux |  |
| `UltraByteSoftwares.markdown-tree` | Markdown Tree | Windows, macOS, Linux |  |
| `shd101wyy.markdown-preview-enhanced` | Markdown Preview Enhanced | Windows, macOS, Linux |  |

**Mapped skills:** `crux-figma-to-code`, `crux-design-system`, `crux-documentation`, `archify`, `graphify`, `theme-factory`

**Mapped rules:** `crux-accessibility-rules`

**Prerequisites**

- No additional runtime prerequisite declared.

## AI Agents & Code Review

Agent clients, orchestration, security review, context, review, planning, and advanced productivity skills.

| Marketplace ID | Tool | Platforms | Note |
| --- | --- | --- | --- |
| `openai.chatgpt` | OpenAI ChatGPT | Windows, macOS, Linux |  |
| `anthropic.claude-code` | Claude Code | Windows, macOS, Linux |  |
| `github.copilot-chat` | GitHub Copilot Chat | Windows, macOS, Linux | Skipped when VS Code already provides a newer built-in version. |

**Mapped skills:** `crux-conductor`, `crux-review-standard`, `security-guidance`, `codex-security`, `trail-of-bits-differential-review`, `supply-chain-risk-auditor`, `coderabbit`, `claude-code-review`, `code-simplifier`, `superpowers`, `planning-with-files`, `grill-me`, `context7`, `mcp-builder`, `skill-creator`, `skill-seekers`, `agensi-ai-code-reviewer`, `claude-mem`

**Mapped rules:** `crux-base-quality-rules`, `crux-security-rules`, `crux-testing-rules`, `crux-technical-lead-rules`, `crux-ai-rag-production-rules`

**Prerequisites**

- Provider authentication and subscriptions are separate from CRUXIDE

## Third-party boundary

Each extension retains its publisher's license, privacy policy, permissions, release cycle, and security posture. Marketplace availability and a publisher badge are not substitutes for organizational allowlisting or source review. Provider authentication and subscriptions remain separate from CRUXIDE.
