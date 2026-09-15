import * as vscode from 'vscode';
import { loadSkillsCatalog } from './skills-catalog.js';
import { createInstallGuide, installSkills, uninstallSkills } from './skills-installer.js';
import { isSkillsMessage } from './skills-message.js';
import type { SkillsCatalog } from './skills-types.js';

export class SkillsPanel {
  static readonly viewType = 'cruxide.skills';
  private static current: SkillsPanel | undefined;

  static async show(context: vscode.ExtensionContext, output: vscode.OutputChannel): Promise<void> {
    if (SkillsPanel.current) {
      SkillsPanel.current.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    const catalog = await loadSkillsCatalog(context.extensionUri);
    const mediaRoot = vscode.Uri.joinPath(context.extensionUri, 'media');
    const panel = vscode.window.createWebviewPanel(
      SkillsPanel.viewType,
      'CRUX Skills Manager',
      vscode.ViewColumn.One,
      { enableScripts: true, localResourceRoots: [mediaRoot] },
    );
    SkillsPanel.current = new SkillsPanel(panel, context, output, catalog);
  }

  private readonly disposables: vscode.Disposable[] = [];

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
    private readonly output: vscode.OutputChannel,
    private readonly catalog: SkillsCatalog,
  ) {
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'crux-logo.png');
    panel.webview.html = this.getHtml(panel.webview);
    panel.onDidDispose(() => {
      SkillsPanel.current = undefined;
      this.dispose();
    }, undefined, this.disposables);
    panel.webview.onDidReceiveMessage((message: unknown) => {
      void this.handleMessage(message);
    }, undefined, this.disposables);
  }

  private async handleMessage(message: unknown): Promise<void> {
    if (!isSkillsMessage(message)) return;
    try {
      if (message.command === 'ready') {
        await this.panel.webview.postMessage({ command: 'catalog', catalog: this.catalog });
        return;
      }
      if (message.command === 'openReadme') {
        if (!this.catalog.skills.some((skill) => skill.id === message.skillId)) return;
        const uri = vscode.Uri.joinPath(this.context.extensionUri, 'skills', 'docs', message.skillId, 'README.md');
        await vscode.commands.executeCommand('markdown.showPreview', uri);
        return;
      }
      if (message.command === 'copyGuide') {
        await vscode.env.clipboard.writeText(createInstallGuide(this.catalog, message.request));
        void vscode.window.showInformationMessage('CRUX Skills installation plan copied.');
        return;
      }

      const uninstalling = message.command === 'uninstall';
      const actionLabel = uninstalling ? 'Uninstall' : 'Install';
      const confirmation = await vscode.window.showInformationMessage(
        `${actionLabel} ${message.request.skillIds.length} selected CRUX Skills entries?`,
        { modal: true, detail: uninstalling ? 'CRUX-owned files are backed up before removal. Project-authored files are not touched.' : 'Bundled CRUX skills are copied locally. Provider-managed entries are documented only; third-party code is not executed.' },
        actionLabel,
      );
      if (confirmation !== actionLabel) return;
      const result = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `${actionLabel}ing CRUX Skills…`, cancellable: false },
        () => uninstalling ? uninstallSkills(this.catalog, message.request) : installSkills(this.context.extensionUri, this.catalog, message.request),
      );
      this.output.appendLine(`Skills ${actionLabel.toLowerCase()} result: ${JSON.stringify(result)}`);
      await this.panel.webview.postMessage({ command: uninstalling ? 'uninstalled' : 'installed', result });
      void vscode.window.showInformationMessage(
        uninstalling ? `CRUX Skills removed: ${result.installed} bundled and ${result.adapters} adapter(s).` : `CRUX Skills ready: ${result.installed} bundled, ${result.external} provider guide(s), ${result.adapters} agent adapter(s).`,
      );
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      this.output.appendLine(`Skills action failed: ${detail}`);
      await this.panel.webview.postMessage({ command: 'error', detail });
      void vscode.window.showErrorMessage(`CRUX Skills: ${detail}`);
    }
  }

  private dispose(): void {
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
  }

  private getHtml(webview: vscode.Webview): string {
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, 'media');
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'skills.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'skills.js'));
    const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'crux-mark.svg'));
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource}`,
      `style-src ${webview.cspSource}`,
      `font-src ${webview.cspSource}`,
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
  <title>CRUX Skills Manager</title>
</head>
<body>
  <header>
    <img src="${escapeAttribute(logoUri.toString())}" alt="CRUX" />
    <div><p class="eyebrow">Portable agent capability layer</p><h1>CRUX Skills</h1><p>Select only what your project and agents need. Nothing installs automatically.</p></div>
  </header>
  <main>
    <section class="setup" aria-labelledby="setup-title">
      <h2 id="setup-title">1. Installation target</h2>
      <div class="scope-grid">
        <label><input type="radio" name="scope" value="project-local" checked /><strong>Project Local</strong><span>Default. Works in this project and stays out of Git via .git/info/exclude.</span></label>
        <label><input type="radio" name="scope" value="project-shared" /><strong>Project Shared</strong><span>Portable skill files can be reviewed and committed for the team.</span></label>
        <label><input type="radio" name="scope" value="user" /><strong>User Global</strong><span>Available to supported agents across your local projects.</span></label>
      </div>
      <h3>Agents</h3><div id="agents" class="check-row"></div>
      <h3>Recommended rules mode</h3>
      <select id="rule-mode"><option value="guidance">Guidance — recommendations only</option><option value="warning">Warning — flag deviations</option><option value="strict">Strict — request compliance</option><option value="custom">Custom — project overrides decide</option></select>
    </section>
    <section class="catalog" aria-labelledby="catalog-title">
      <div class="catalog-head"><div><h2 id="catalog-title">2. Choose Skills & Rules</h2><p id="summary">Loading catalog…</p></div><div class="tools"><input id="search" type="search" placeholder="Search skills…" aria-label="Search skills" /><select id="category" aria-label="Filter by category"><option value="">All categories</option></select></div></div>
      <div class="bulk"><button id="recommended" type="button">Select recommended</button><button id="clear" type="button" class="secondary">Clear</button></div>
      <div id="skill-list" class="skill-list" aria-live="polite"></div>
    </section>
    <section class="review" aria-labelledby="review-title">
      <h2 id="review-title">3. Review & Install</h2>
      <ul><li>No application runtime dependencies.</li><li>No package.json, node_modules, Git hooks, or shared .gitignore changes.</li><li>External/provider skills are documented and require your separate review.</li><li>Existing skill files are backed up before replacement.</li></ul>
      <div class="actions"><button id="install" type="button">Install selected</button><button id="copy" type="button" class="secondary">Copy plan / agent prompt</button><button id="uninstall" type="button" class="danger">Uninstall selected</button></div>
      <p id="status" role="status"></p>
    </section>
  </main>
  <script src="${escapeAttribute(scriptUri.toString())}"></script>
</body>
</html>`;
  }
}

function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
