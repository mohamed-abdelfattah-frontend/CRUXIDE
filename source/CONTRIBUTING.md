# Contributing

Use Node.js 22 and npm 11. Install from the lockfile with `npm ci`, make focused changes, and run `npm run verify` before submitting them.

Do not add runtime dependencies, network access, workspace code execution, shell execution, telemetry, or new webview commands without updating tests, privacy documentation, and the threat model.

Brand geometry must come from the authoritative CRUX Figma components. Do not redraw or approximate the CRUX Mark.

The canonical symbol is Figma component `21:3` / group `21:5`; the application/favicon source is component `22:104`. Bundled fonts are pinned to the Google Fonts revision documented in `THIRD_PARTY_NOTICES.md` and must retain their OFL notices.
