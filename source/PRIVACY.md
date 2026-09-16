# Privacy

CRUXIDE does not collect analytics, telemetry, crash reports, workspace content, file names, credentials, or personal information.

The extension does not make background network requests. It reads only VS Code APIs needed to determine whether a workspace contains a configured code-file extension, and it asks VS Code to execute a small allowlist of actions selected by the user. The Home page can open the fixed CRUXCODE and founder LinkedIn HTTPS pages in the system browser only when their buttons are pressed.

When the user explicitly confirms Setup or a Skills Manager installation, CRUXIDE copies selected bundled Markdown skills to `.crux` or `~/.cruxide`, writes agent adapter files and managed project-rule pointers, generates `PROJECT_RULES.md`, and records a local lock/config file. Project Local may write a private managed block to `.git/info/exclude`; it does not change the shared `.gitignore`. These local files are not transmitted to CRUXCODE. Provider-managed entries are not downloaded or executed.

Visual Studio Code and separately installed extensions have their own privacy practices and settings. CRUXIDE changes an extension set only after the user reviews a track plan and confirms installation.

The release installer installs only CRUXIDE. The extension asks VS Code to connect to the Visual Studio Marketplace for confirmed, missing track extensions. Those tools, including AI integrations, may connect to their own services and are governed by their publishers' privacy terms. CRUXIDE itself does not receive that data.
