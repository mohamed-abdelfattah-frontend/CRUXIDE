import type { TrackExtension, TracksCatalog, ToolTrack } from './tracks-types.js';

const extension = (
  id: string,
  name: string,
  options: Omit<TrackExtension, 'id' | 'name'> = {},
): TrackExtension => ({ id, name, ...options });

const track = (
  id: string,
  name: string,
  category: string,
  description: string,
  extensions: readonly TrackExtension[],
  skillIds: readonly string[],
  ruleIds: readonly string[],
  prerequisites: readonly string[] = [],
  tags: readonly string[] = [],
  required = false,
): ToolTrack => ({
  id,
  name,
  category,
  description,
  required,
  extensions,
  skillIds,
  ruleIds,
  prerequisites,
  tags,
});

export const TRACKS_CATALOG: TracksCatalog = {
  schemaVersion: 1,
  tracks: [
    track('core', 'CRUX Core', 'Core',
      'Profile essentials, portable project guidance, spelling, YAML, Markdown, and the CRUX visual experience.', [
        extension('editorconfig.editorconfig', 'EditorConfig'),
        extension('streetsidesoftware.code-spell-checker', 'Code Spell Checker'),
        extension('redhat.vscode-yaml', 'YAML'),
        extension('davidanson.vscode-markdownlint', 'markdownlint'),
        extension('aaron-bond.better-comments', 'Better Comments'),
        extension('nhoizey.gremlins', 'Gremlins'),
        extension('pkief.material-icon-theme', 'Material Icon Theme'),
      ], [
        'crux-conductor', 'crux-architecture-guardrails', 'crux-solution-architecture',
        'crux-planning-adr', 'crux-testing-strategy', 'crux-performance-audit',
        'crux-documentation', 'crux-secure-coding', 'crux-threat-modeling',
        'crux-secrets-dependency-audit',
      ], [
        'crux-base-quality-rules', 'crux-clean-architecture-rules', 'crux-git-workflow-rules',
        'crux-security-rules', 'crux-testing-rules',
      ], [], ['core', 'architecture', 'documentation'], true),

    track('quality-testing', 'Quality & Testing', 'Core',
      'Formatting, linting, browser testing, code metrics, TODOs, and focused developer utilities.', [
        extension('dbaeumer.vscode-eslint', 'ESLint'),
        extension('esbenp.prettier-vscode', 'Prettier'),
        extension('stylelint.vscode-stylelint', 'Stylelint'),
        extension('ms-playwright.playwright', 'Playwright Test'),
        extension('alefragnani.separators', 'Separators'),
        extension('cpmcgrath.codealignment-vscode', 'Code Alignment'),
        extension('kisstkondoros.vscode-codemetrics', 'CodeMetrics'),
        extension('bracketpaircolordlw.bracket-pair-color-dlw', 'Bracket Pair Color DLW'),
        extension('wayou.vscode-todo-highlight', 'TODO Highlight'),
        extension('gruntfuggly.todo-tree', 'Todo Tree'),
      ], ['crux-testing-strategy', 'crux-review-standard', 'playwright-web-testing'], [
        'crux-eslint-rules', 'crux-testing-rules', 'crux-performance-rules',
      ], [], ['lint', 'testing', 'review']),

    track('frontend-shared', 'Frontend Shared', 'Frontend',
      'Shared HTML, CSS, SCSS, Tailwind, shadcn/ui, imports, paths, snippets, and design-system tooling.', [
        extension('bradlc.vscode-tailwindcss', 'Tailwind CSS IntelliSense'),
        extension('suhelmakkad.shadcn-ui', 'shadcn/ui'),
        extension('anbuselvanrocky.bootstrap5-vscode', 'Bootstrap 5 Snippets'),
        extension('p-de-jong.vscode-html-scss', 'HTML SCSS Support'),
        extension('mrmlnc.vscode-scss', 'SCSS IntelliSense'),
        extension('xabikos.javascriptsnippets', 'JavaScript ES6 Snippets'),
        extension('steoates.autoimport', 'Auto Import'),
        extension('formulahendry.auto-rename-tag', 'Auto Rename Tag'),
        extension('naumovs.color-highlight', 'Color Highlight'),
        extension('christian-kohler.npm-intellisense', 'npm Intellisense'),
        extension('christian-kohler.path-intellisense', 'Path Intellisense'),
      ], [
        'crux-frontend-architecture', 'crux-tailwind-shadcn', 'crux-design-system',
        'crux-accessibility-i18n', 'frontend-design', 'web-design-guidelines',
        'building-components', 'build-web-apps',
      ], ['crux-accessibility-rules', 'crux-performance-rules'], [], ['web', 'ui', 'css']),

    track('frontend-angular', 'Angular', 'Frontend',
      'Official Angular language tooling plus Angular-oriented snippets and architecture guidance.', [
        extension('angular.ng-template', 'Angular Language Service'),
        extension('johnpapa.angular2', 'Angular Snippets'),
      ], ['crux-angular-architecture'], ['crux-eslint-rules'], ['Node.js and the Angular CLI used by the project'], ['angular', 'typescript']),

    track('frontend-react', 'React', 'Frontend',
      'React snippets, composition patterns, architecture, testing, and production best practices.', [
        extension('dsznajder.es7-react-js-snippets', 'ES7+ React/Redux/React-Native Snippets'),
      ], ['crux-react-architecture', 'vercel-react-best-practices', 'vercel-composition-patterns'], ['crux-eslint-rules'], ['Node.js and the package manager used by the project'], ['react', 'typescript']),

    track('frontend-nextjs', 'Next.js', 'Frontend',
      'Next.js App Router guidance, snippets, server/client boundaries, and Vercel-maintained practices.', [
        extension('pulkitgangwar.nextjs-snippets', 'Next.js Snippets'),
      ], ['crux-nextjs-architecture', 'vercel-nextjs-best-practices'], ['crux-eslint-rules', 'crux-security-rules'], ['Node.js supported by the project Next.js version'], ['nextjs', 'react']),

    track('mobile-react-native', 'React Native & Expo', 'Mobile',
      'Microsoft React Native runtime tooling, snippets, native-boundary guidance, and Expo workflows.', [
        extension('msjsdiag.vscode-react-native', 'React Native Tools'),
        extension('jundat95.react-native-snippet', 'React Native Snippet'),
      ], ['crux-react-native-architecture', 'crux-mobile-quality', 'vercel-react-native-skills', 'expo-development'], ['crux-security-rules', 'crux-accessibility-rules'], ['A working React Native or Expo environment', 'Android SDK for Android targets', 'macOS and Xcode for iOS targets'], ['react-native', 'expo']),

    track('mobile-android', 'Android & Kotlin', 'Mobile',
      'Official JetBrains Kotlin language support with Gradle and CRUX Android/Compose guidance.', [
        extension('JetBrains.kotlin-server', 'Kotlin by JetBrains', { note: 'Official extension; currently Alpha.' }),
        extension('vscjava.vscode-gradle', 'Gradle for Java'),
      ], ['crux-android-kotlin', 'crux-mobile-quality', 'test-android-apps'], ['crux-security-rules', 'crux-testing-rules', 'crux-accessibility-rules'], ['JDK', 'Android SDK and platform tools', 'Android Studio remains recommended for full Android SDK and device management'], ['android', 'kotlin', 'compose']),

    track('mobile-ios', 'iOS & Swift', 'Mobile',
      'Official Swift language tooling plus optional macOS-only Xcode project integration.', [
        extension('swiftlang.swift-vscode', 'Swift for Visual Studio Code'),
        extension('sweetpad.sweetpad', 'SweetPad', { platforms: ['darwin'], note: 'macOS only; requires Xcode.' }),
      ], ['crux-ios-swift', 'crux-mobile-quality', 'build-ios-apps'], ['crux-security-rules', 'crux-testing-rules', 'crux-accessibility-rules'], ['Swift toolchain', 'macOS and Xcode are required for native iOS builds'], ['ios', 'swift', 'swiftui']),

    track('mobile-flutter', 'Flutter & Dart', 'Mobile',
      'Flutter editing, refactoring, run/debug support, Dart dependency, and CRUX mobile architecture.', [
        extension('Dart-Code.flutter', 'Flutter', { note: 'Installs the Dart extension automatically.' }),
      ], ['crux-flutter-architecture', 'crux-mobile-quality'], ['crux-security-rules', 'crux-testing-rules', 'crux-accessibility-rules'], ['Flutter SDK available on PATH', 'Platform SDKs for the intended targets'], ['flutter', 'dart']),

    track('backend-node', 'Node.js', 'Backend',
      'Node.js snippets, API workflows, runtime architecture, testing, and production lifecycle guidance.', [
        extension('chris-noring.node-snippets', 'Node Snippets'),
        extension('humao.rest-client', 'REST Client'),
      ], ['crux-nodejs-architecture', 'crux-api-design', 'crux-backend-testing', 'crux-distributed-systems'], ['crux-api-rules', 'crux-security-rules', 'crux-testing-rules'], ['Node.js and the project package manager'], ['nodejs', 'api']),

    track('backend-express', 'Express', 'Backend',
      'Express snippets and secure middleware, validation, lifecycle, and service-boundary guidance.', [
        extension('Compulim.vscode-express', 'Express'),
      ], ['crux-express-architecture'], ['crux-api-rules', 'crux-security-rules'], ['Node.js'], ['express', 'nodejs']),

    track('backend-nestjs', 'NestJS', 'Backend',
      'NestJS snippets and generators with module, DI, guard, pipe, and interceptor guidance.', [
        extension('imgildev.vscode-nestjs-snippets-extension', 'NestJS Snippets'),
        extension('imgildev.vscode-nestjs-generator', 'NestJS Generator'),
      ], ['crux-nestjs-architecture'], ['crux-api-rules', 'crux-security-rules'], ['Node.js and Nest CLI when required by the project'], ['nestjs', 'nodejs']),

    track('backend-php-laravel', 'PHP & Laravel', 'Backend',
      'PHP language intelligence, the official Laravel extension, debugging, and production backend guidance.', [
        extension('bmewburn.vscode-intelephense-client', 'PHP Intelephense'),
        extension('laravel.vscode-laravel', 'Laravel'),
        extension('xdebug.php-debug', 'PHP Debug'),
      ], ['crux-php-architecture', 'crux-laravel-architecture', 'crux-api-design', 'crux-backend-testing'], ['crux-api-rules', 'crux-security-rules', 'crux-testing-rules'], ['PHP runtime', 'Composer', 'Xdebug for debugging', 'PHP 8.2+ for the official Laravel extension'], ['php', 'laravel']),

    track('backend-dotnet', '.NET & ASP.NET Core', 'Backend',
      'Microsoft C# Dev Kit with .NET/ASP.NET Core architecture, testing, and API guidance.', [
        extension('ms-dotnettools.csdevkit', 'C# Dev Kit', { note: 'Use is subject to Microsoft licensing terms.' }),
      ], ['crux-dotnet-architecture', 'crux-api-design', 'crux-backend-testing'], ['crux-api-rules', 'crux-security-rules', 'crux-testing-rules'], ['A supported .NET SDK'], ['dotnet', 'aspnet', 'csharp']),

    track('backend-java-spring', 'Java & Spring Boot', 'Backend',
      'Microsoft Java pack and Spring Tools with JVM service architecture and API guidance.', [
        extension('vscjava.vscode-java-pack', 'Extension Pack for Java'),
        extension('vmware.vscode-boot-dev-pack', 'Spring Boot Extension Pack'),
      ], ['crux-java-spring-architecture', 'crux-api-design', 'crux-backend-testing'], ['crux-api-rules', 'crux-security-rules', 'crux-testing-rules'], ['A JDK supported by the project', 'Maven or Gradle when used by the project'], ['java', 'spring-boot']),

    track('backend-go-rust', 'Go & Rust', 'Backend',
      'Official Go and rust-analyzer language tooling with production service guidance.', [
        extension('golang.go', 'Go'),
        extension('rust-lang.rust-analyzer', 'rust-analyzer'),
      ], ['crux-go-rust-backend', 'crux-api-design', 'crux-backend-testing'], ['crux-api-rules', 'crux-security-rules', 'crux-testing-rules'], ['Go toolchain for Go projects', 'Rustup and Cargo for Rust projects'], ['go', 'rust']),

    track('ai-python', 'Python, AI & Data Science', 'AI & Data',
      'Microsoft Python/Jupyter tooling, Ruff, Data Wrangler, and CRUX AI/backend engineering guidance.', [
        extension('ms-python.python', 'Python', { note: 'Installs supported Python language/debug dependencies.' }),
        extension('ms-toolsai.jupyter', 'Jupyter'),
        extension('charliermarsh.ruff', 'Ruff'),
        extension('ms-toolsai.datawrangler', 'Data Wrangler'),
      ], ['crux-python-ai-engineering', 'crux-python-backend', 'crux-rag-architecture', 'crux-agentic-ai', 'crux-langchain-langgraph'], ['crux-ai-rules', 'crux-security-rules', 'crux-testing-rules'], ['Python runtime and a project environment manager', 'Jupyter kernel packages when notebooks are used'], ['python', 'ai', 'ml', 'data']),

    track('databases', 'Databases & Data Tools', 'AI & Data',
      'SQL clients and drivers for common backend data workflows plus database engineering guidance.', [
        extension('mtxr.sqltools', 'SQLTools'),
        extension('mtxr.sqltools-driver-pg', 'SQLTools PostgreSQL Driver'),
        extension('mtxr.sqltools-driver-mysql', 'SQLTools MySQL/MariaDB Driver'),
        extension('ms-mssql.mssql', 'SQL Server (mssql)'),
        extension('mechatroner.rainbow-csv', 'Rainbow CSV'),
      ], ['crux-database-engineering', 'supabase-postgres-best-practices'], ['crux-security-rules', 'crux-performance-rules'], ['Database clients and credentials supplied by the developer'], ['sql', 'postgresql', 'mysql', 'mssql']),

    track('devops-containers', 'Containers & DevOps', 'Platform',
      'Containers, dev containers, CI/CD, GitHub Actions, and secure delivery guidance.', [
        extension('ms-azuretools.vscode-containers', 'Container Tools'),
        extension('ms-vscode-remote.remote-containers', 'Dev Containers'),
        extension('github.vscode-github-actions', 'GitHub Actions'),
      ], ['crux-docker-containers', 'crux-cicd', 'github-actions', 'turborepo', 'sentry-observability', 'vercel-deployment', 'cloudflare'], ['crux-security-rules', 'crux-testing-rules'], ['Docker or a compatible container runtime when container commands are used'], ['docker', 'ci', 'cd']),

    track('git-collaboration', 'Git & Collaboration', 'Platform',
      'Pull requests, history, graphing, collaboration, and Git workflow guidance.', [
        extension('github.vscode-pull-request-github', 'GitHub Pull Requests'),
        extension('eamodio.gitlens', 'GitLens'),
        extension('donjayamanne.git-extension-pack', 'Git Extension Pack'),
        extension('mhutchie.git-graph', 'Git Graph'),
        extension('donjayamanne.githistory', 'Git History'),
        extension('ms-vsliveshare.vsliveshare', 'Live Share'),
      ], ['github-integration', 'crux-review-standard'], ['crux-git-workflow-rules', 'crux-base-quality-rules'], ['Git', 'Authentication for remote providers when required'], ['git', 'github', 'collaboration']),

    track('design-documentation', 'Design & Documentation', 'Productivity',
      'Figma integration, previews, diagrams, screenshots, project navigation, and structured documentation tools.', [
        extension('figma.figma-vscode-extension', 'Figma for VS Code'),
        extension('quicktype.quicktype', 'Paste JSON as Code'),
        extension('mariusalchimavicius.json-to-ts', 'JSON to TS'),
        extension('aykutsarac.jsoncrack-vscode', 'JSON Crack'),
        extension('alefragnani.project-manager', 'Project Manager'),
        extension('jmkrivocapich.drawfolderstructure', 'Draw Folder Structure'),
        extension('adpyke.codesnap', 'CodeSnap'),
        extension('simonsiefke.svg-preview', 'SVG Preview'),
        extension('UltraByteSoftwares.markdown-tree', 'Markdown Tree'),
        extension('shd101wyy.markdown-preview-enhanced', 'Markdown Preview Enhanced'),
      ], ['crux-figma-to-code', 'crux-design-system', 'crux-documentation', 'archify', 'graphify', 'theme-factory'], ['crux-accessibility-rules'], [], ['figma', 'docs', 'diagramming']),

    track('ai-agents-review', 'AI Agents & Code Review', 'AI & Data',
      'Agent clients, orchestration, security review, context, review, planning, and advanced productivity skills.', [
        extension('openai.chatgpt', 'OpenAI ChatGPT'),
        extension('anthropic.claude-code', 'Claude Code'),
        extension('github.copilot-chat', 'GitHub Copilot Chat', { note: 'Skipped when VS Code already provides a newer built-in version.' }),
      ], [
        'crux-conductor', 'crux-review-standard', 'security-guidance', 'codex-security',
        'trail-of-bits-differential-review', 'supply-chain-risk-auditor', 'coderabbit',
        'claude-code-review', 'code-simplifier', 'superpowers', 'planning-with-files',
        'grill-me', 'context7', 'mcp-builder', 'skill-creator', 'skill-seekers',
        'agensi-ai-code-reviewer', 'claude-mem',
      ], ['crux-base-quality-rules', 'crux-security-rules', 'crux-testing-rules'], ['Provider authentication and subscriptions are separate from CRUXIDE'], ['agents', 'code-review', 'orchestration']),
  ],
};

export function resolveTracks(ids: readonly string[]): ToolTrack[] {
  const byId = new Map(TRACKS_CATALOG.tracks.map((item) => [item.id, item]));
  const required = TRACKS_CATALOG.tracks.filter((item) => item.required).map((item) => item.id);
  return [...new Set([...required, ...ids])].map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`Unknown CRUXIDE track: ${id}`);
    return item;
  });
}

export function extensionPlan(tracks: readonly ToolTrack[], platform: NodeJS.Platform): TrackExtension[] {
  const unique = new Map<string, TrackExtension>();
  for (const item of tracks) {
    for (const candidate of item.extensions) {
      if (candidate.platforms && !candidate.platforms.includes(platform as 'win32' | 'darwin' | 'linux')) continue;
      unique.set(candidate.id.toLowerCase(), candidate);
    }
  }
  return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function skillPlan(tracks: readonly ToolTrack[]): string[] {
  return [...new Set(tracks.flatMap((item) => [...item.skillIds, ...item.ruleIds]))].sort();
}
