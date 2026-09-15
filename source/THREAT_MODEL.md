# Threat Model

## Protected assets

- workspace contents and user settings;
- VS Code profile integrity;
- extension installation integrity;
- the CRUX brand identity.

## Trust boundaries

1. The extracted release archive and local installer.
2. VS Code's extension host and profile APIs.
3. The CRUXIDE Home webview.
4. Workspace files, including untrusted workspaces.
5. Optional CRUX Skills destinations and external provider metadata.

## Controls

- Installers validate the VSIX against `SHA256SUMS.txt` and verify the exact installed extension ID.
- The Windows installer never uses the GUI executable for CLI installation.
- The Home webview has a restrictive local resource root and a default-deny CSP.
- Webview messages accept exact allowlisted actions and validated structured skill selections; no arbitrary command ID, filesystem path, or URL crosses the boundary. External Home navigation is limited to two fixed HTTPS destinations.
- The extension uses no shell, process, task, terminal, authentication, secret, or network execution API. Project writes occur only after explicit confirmation in a trusted workspace and are confined to fixed skill roots and a managed Git exclude block.
- Provider-managed skills are documented but never fetched or executed by CRUXIDE. Bundled CRUX skills contain Markdown and metadata only.
- Settings are changed only after explicit consent or an explicit command.
- Untrusted and virtual workspaces are supported because CRUXIDE does not execute workspace code.
- The curated third-party extensions use fixed Marketplace IDs, are installed by the VS Code CLI, and are verified by exact ID after installation.
- Bundled font and icon files are verified before the installers copy them into user-level locations.
- The Windows installer verifies the Microsoft Authenticode signature on `Code.exe` before invoking the associated CLI.

## Residual risks

- A checksum shipped beside an artifact detects corruption but does not establish publisher identity. Public releases should additionally be signed or distributed through an authenticated release channel.
- The launcher is still Microsoft Visual Studio Code. Its security posture and update process remain upstream responsibilities.
- Curated extensions have their own permissions, update cadence, network behavior, and privacy terms. CRUXIDE does not bypass VS Code's Marketplace integrity controls, but users should still review publisher trust and extension settings.
- Marketplace presence and publisher-domain verification are not substitutes for a full source audit of every third-party extension. Release packaging fails if a selected ID is unavailable, but third-party updates remain an upstream supply-chain risk.
- Agent support for portable skills varies by product/version. Adapter files make the canonical instructions discoverable but cannot guarantee that every agent will enforce them.
- Strict rules mode is agent guidance rather than an operating-system sandbox or CI policy. Teams requiring enforcement should review and implement separate CI controls.
