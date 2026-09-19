# Publishing CRUXIDE

CRUXIDE uses two separate release gates: GitHub Release creation and Visual Studio Marketplace publication. Building a tag never publishes to the Marketplace automatically.

## One-time repository setup

1. Confirm the `cruxcode` Visual Studio Marketplace publisher is controlled by the CRUXCODE.DEV release owner.
2. Enable GitHub private vulnerability reporting for this repository.
3. Enable GitHub code scanning before relying on the Security tab. Until it is enabled, CI still runs CodeQL and retains the SARIF report as a workflow artifact.
4. Create a Marketplace token with only the permissions required to manage extensions for the `cruxcode` publisher.
5. Create a protected GitHub Environment named `vscode-marketplace`, add the token as the `VSCE_PAT` environment secret, and require an authorized reviewer.
6. Import `CRUXIDE-main-protection.ruleset.json`, keep Mohamed as the only pull-request bypass actor, and require the CI, governance, dependency review, and CodeQL checks.
7. Enable Dependency Graph, Dependabot alerts, secret scanning, push protection, code scanning, and private vulnerability reporting in **Settings → Code security**.

Never paste the token into a terminal transcript, issue, pull request, repository file, or chat message. Rotate it immediately if it is exposed.

## Release procedure

1. Update the package version, changelog, installer references, and lockfile in the same pull request.
2. Run `npm ci`, `npm run verify`, `npm run smoke:test`, and `npm run package:release` from the repository root.
3. Test the generated VSIX on supported Windows and macOS installations. Also test manual VSIX installation in Cursor before claiming compatibility.
4. Merge only after the protected checks and human smoke testing pass.
5. Create and push an annotated tag matching the package version exactly, for example `v1.2.0`.
6. The **Release** workflow validates the tag, rebuilds the artifacts, generates a CycloneDX SBOM, writes SHA-256 checksums, creates signed provenance and SBOM attestations, and creates the GitHub Release.
7. Download the GitHub Release once and verify that the ZIP installs cleanly on Windows and macOS.
8. Run **Publish VS Code Marketplace** manually with the exact release tag. The protected environment requires approval, downloads the existing GitHub Release asset, verifies its checksum, and publishes that exact VSIX.
9. Verify the public Marketplace page and perform a clean install and an update from the previous version.

## Workflow inventory

- **CI**: cross-platform verification, extension-host smoke tests, and a packaged release artifact.
- **Governance**: Conventional Commit PR titles, approved branch prefixes, immutable action SHAs, and safe workflow triggers.
- **Dependency Review**: blocks pull requests that introduce high or critical known vulnerabilities.
- **CodeQL**: extended JavaScript/TypeScript security analysis uploaded to GitHub code scanning.
- **OpenSSF Scorecard**: weekly and configuration-triggered supply-chain posture analysis.
- **Ecosystem Health**: weekly dependency, registry-signature, and Marketplace catalog checks.
- **Release**: immutable artifacts, checksums, SBOM, attestations, and GitHub Release creation.
- **Publish VS Code Marketplace**: protected manual promotion of the exact attested release VSIX.

Prefer a forward hotfix release over unpublishing. Unpublish only for a security, legal, or destructive-installation emergency.

## Platform scope

- Visual Studio Code: supported by the VSIX and Marketplace workflow.
- Cursor: the VSIX can be tested and installed manually; a separate Cursor listing or compatibility claim requires Cursor-side validation.
- WebStorm: not produced by this repository. JetBrains Marketplace support requires a separate IntelliJ Platform plugin, build, signing, and review process.
