import * as vscode from 'vscode';
import { applySetup, getSetupState } from './setup-installer.js';
import { isSetupMessage } from './setup-message.js';
import { extensionPlan, resolveTracks, skillPlan, TRACKS_CATALOG } from './tracks-catalog.js';

export class SetupPanel {
  static readonly viewType = 'cruxide.setup';
  private static current: SetupPanel | undefined;

  static show(context: vscode.ExtensionContext, output: vscode.OutputChannel): void {
    if (SetupPanel.current) {
      SetupPanel.current.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    const mediaRoot = vscode.Uri.joinPath(context.extensionUri, 'media');
    const panel = vscode.window.createWebviewPanel(
      SetupPanel.viewType,
      'CRUXIDE Setup',
      vscode.ViewColumn.One,
      { enableScripts: true, localResourceRoots: [mediaRoot] },
    );
    SetupPanel.current = new SetupPanel(panel, context, output);
  }

  private readonly disposables: vscode.Disposable[] = [];

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
    private readonly output: vscode.OutputChannel,
  ) {
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'crux-logo.png');
    panel.webview.html = this.getHtml(panel.webview);
    panel.onDidDispose(() => {
      SetupPanel.current = undefined;
      this.dispose();
    }, undefined, this.disposables);
    panel.webview.onDidReceiveMessage((message: unknown) => {
      void this.handleMessage(message);
    }, undefined, this.disposables);
  }

  private async handleMessage(message: unknown): Promise<void> {
    if (!isSetupMessage(message)) return;
    try {
      if (message.command === 'ready') {
        await this.panel.webview.postMessage({
          command: 'setupData',
          catalog: TRACKS_CATALOG,
          saved: getSetupState(this.context),
          environment: {
            platform: process.platform,
            hasWorkspace: (vscode.workspace.workspaceFolders ?? []).some((folder) => folder.uri.scheme === 'file'),
            trusted: vscode.workspace.isTrusted,
          },
        });
        return;
      }

      if (message.command === 'openProfiles') {
        await openProfilesManager();
        return;
      }

      if (message.request.profileTarget === 'dedicated') {
        const action = await vscode.window.showInformationMessage(
          'VS Code extensions can only configure the active profile. Create or switch to a dedicated CRUXIDE profile, then run CRUXIDE Setup again.',
          { modal: true, detail: 'CRUXIDE will not install tools into the wrong profile or invoke an external CLI silently.' },
          'Open Profiles',
        );
        if (action === 'Open Profiles') await openProfilesManager();
        await this.panel.webview.postMessage({ command: 'profileRequired' });
        return;
      }

      const tracks = resolveTracks(message.request.trackIds);
      const plannedExtensions = extensionPlan(tracks, process.platform);
      const plannedSkills = skillPlan(tracks);
      const confirmation = await vscode.window.showInformationMessage(
        `Apply ${tracks.length} CRUXIDE tracks to the active profile?`,
        {
          modal: true,
          detail: `${plannedExtensions.length} unique extensions will be checked and missing ones installed. ${plannedSkills.length} mapped skills/rules will be prepared for the selected agents. No language runtime, SDK, project package, or dependency is installed.`,
        },
        'Apply setup',
      );
      if (confirmation !== 'Apply setup') return;

      const result = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Applying CRUXIDE tracks…', cancellable: false },
        () => applySetup(this.context, this.output, message.request),
      );
      await vscode.commands.executeCommand('cruxide.applyExperience');
      this.output.appendLine(`Setup result: ${JSON.stringify(result)}`);
      await this.panel.webview.postMessage({ command: 'applied', result });

      const failureText = result.failedExtensions.length > 0
        ? ` ${result.failedExtensions.length} extension(s) need manual review; see CRUXIDE output.`
        : '';
      const skillsText = result.skillsDeferred
        ? ' Open and trust a local project, then run Setup again to create project skills and rules.'
        : '';
      void vscode.window.showInformationMessage(
        `CRUXIDE setup applied: ${result.installedExtensions.length} extension(s) installed, ${result.alreadyInstalledExtensions.length} already available.${failureText}${skillsText}`,
      );
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      this.output.appendLine(`Setup failed: ${detail}`);
      await this.panel.webview.postMessage({ command: 'error', detail });
      void vscode.window.showErrorMessage(`CRUXIDE Setup: ${detail}`);
    }
  }

  private dispose(): void {
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
  }

  private getHtml(webview: vscode.Webview): string {
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, 'media');
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'setup.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'setup.js'));
    const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'crux-mark.svg'));
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource}`,
      `style-src ${webview.cspSource}`,
      `script-src ${webview.cspSource}`,
      "base-uri 'none'",
      "form-action 'none'",
    ].join('; ');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="${escapeAttribute(csp)}" />
  <link rel="stylesheet" href="${escapeAttribute(styleUri.toString())}" />
  <title>CRUXIDE Setup</title>
</head>
<body>
  <header>
    <img src="${escapeAttribute(logoUri.toString())}" alt="CRUX" />
    <div><p class="eyebrow">Track-based developer experience</p><h1>CRUXIDE Setup</h1><p>Choose exactly what this profile and project need. Everything is selected by default; review it before installation.</p></div>
  </header>
  <main>
    <section aria-labelledby="profile-title">
      <div class="section-heading"><span>01</span><div><h2 id="profile-title">Profile target</h2><p>CRUXIDE installs extensions only into the active VS Code profile.</p></div></div>
      <div class="choice-grid">
        <label><input type="radio" name="profile" value="current" checked /><strong>Current active profile</strong><small>Apply the selected tracks here after confirmation.</small></label>
        <label><input type="radio" name="profile" value="dedicated" /><strong>Dedicated CRUXIDE profile</strong><small>Open VS Code Profiles first, create or switch, then rerun this setup.</small></label>
      </div>
      <button id="profiles" type="button" class="link-button">Open VS Code Profiles</button>
    </section>

    <section aria-labelledby="tracks-title">
      <div class="section-heading"><span>02</span><div><h2 id="tracks-title">Tracks</h2><p>All tracks start selected. Uncheck anything this profile does not need.</p></div></div>
      <div class="toolbar"><button id="all" type="button">Select all</button><button id="core" type="button" class="secondary">Core only</button><input id="search" type="search" placeholder="Search tracks…" aria-label="Search tracks" /></div>
      <p id="summary" class="summary">Loading tracks…</p>
      <div id="track-list" class="track-list" aria-live="polite"></div>
    </section>

    <section aria-labelledby="agents-title">
      <div class="section-heading"><span>03</span><div><h2 id="agents-title">Agents, skills & rules</h2><p>Mapped skills and rules are installed for the agents and scope you choose.</p></div></div>
      <h3>Agents</h3><div id="agents" class="check-row"></div>
      <div class="settings-grid">
        <label><span>Skills scope</span><select id="scope"><option value="project-local">Project Local — private by default</option><option value="project-shared">Project Shared — commit for the team</option><option value="user">User Global</option></select></label>
        <label><span>Rules mode</span><select id="rule-mode"><option value="guidance">Guidance — recommendations</option><option value="warning">Warning — flag deviations</option><option value="strict">Strict — request compliance</option><option value="custom">Custom — project decides</option></select></label>
      </div>
      <p id="environment" class="notice"></p>
    </section>

    <section aria-labelledby="review-title">
      <div class="section-heading"><span>04</span><div><h2 id="review-title">Review & apply</h2><p>Nothing installs until you confirm the native VS Code dialog.</p></div></div>
      <ul class="guardrails"><li>No Node, Python, PHP, Java, .NET, Android, Flutter, or Apple SDK is installed.</li><li>No application dependency or package manifest is modified.</li><li>Already-installed extensions are preserved and never downgraded.</li><li>Removing a track later does not silently uninstall tools you may still use.</li></ul>
      <button id="apply" type="button" class="primary">Review and apply setup</button>
      <p id="status" role="status"></p>
    </section>
  </main>
  <script src="${escapeAttribute(scriptUri.toString())}"></script>
</body>
</html>`;
  }
}

async function openProfilesManager(): Promise<void> {
  try {
    await vscode.commands.executeCommand('workbench.profiles.actions.manageProfiles');
  } catch {
    await vscode.commands.executeCommand('workbench.action.showCommands');
    void vscode.window.showInformationMessage('Run “Profiles: Create Profile” or “Profiles: Switch Profile”, then reopen CRUXIDE Setup.');
  }
}

function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
