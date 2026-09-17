# Security Policy

## Supported version

Security fixes are provided for the latest released CRUXIDE major version.

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue. Use the repository's [private vulnerability reporting form](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/security/advisories/new) and include:

- affected CRUXIDE version;
- reproduction steps and impact;
- relevant logs with credentials and personal data removed;
- whether the issue requires an untrusted workspace.

Repository maintainers must keep GitHub private vulnerability reporting enabled before any public Marketplace release. If the private form is unavailable, do not publish details in a public issue; contact a repository maintainer through GitHub instead.

## Release controls

- Release archives include SHA-256 checksums for the VSIX, icon, and bundled fonts.
- The VSIX contains no production npm dependencies or source maps.
- CI runs strict type checking, linting, tests, npm audit, and CodeQL.
- Both webviews use only packaged assets under a default-deny Content Security Policy. Messages, skill IDs, agent IDs, scopes, and modes are validated against fixed allowlists; no arbitrary command or URL crosses the boundary.
- Project skill/rule installation requires Workspace Trust, confines writes to fixed per-project or per-user roots plus documented managed agent-instruction files, and executes no provider scripts, package managers, hooks, or workspace code.
- Existing bundled skill folders are backed up before replacement. Provider-managed catalog entries generate review documentation only.
- Curated third-party extensions are grouped by track and referenced by fixed Marketplace IDs rather than repackaged. The user reviews and confirms the plan before VS Code performs its normal Marketplace installation.
- Already-installed and application-scoped extensions are detected before installation; CRUXIDE never intentionally downgrades a newer built-in extension and never silently uninstalls tools when a track is deselected.
- Fonts are pinned to an immutable Google Fonts source revision and distributed with their OFL licenses.
- The Windows installer requires the resolved `Code.exe` to have a valid Microsoft Authenticode signature and requires `code.cmd` to belong to that same installation.
- Public Marketplace publication requires control of the `cruxcode` publisher identity owned by CRUXCODE.DEV. The release workflow accepts the Marketplace token only from the protected `vscode-marketplace` GitHub Environment, never from source code, logs, pull requests, or release archives.
