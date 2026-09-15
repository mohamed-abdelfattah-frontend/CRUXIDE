import * as vscode from 'vscode';
import { type HomeCommand, isHomeMessage } from './home-message.js';

const CRUXCODE_URL = vscode.Uri.parse('https://www.cruxcode.dev');
const LINKEDIN_URL = vscode.Uri.parse('https://www.linkedin.com/in/mohamed-khaled-abdelfattah');

export class HomePanel {
  static readonly viewType = 'cruxide.home';
  private static current: HomePanel | undefined;

  static show(extensionUri: vscode.Uri, extensionVersion: string): void {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (HomePanel.current) {
      HomePanel.current.panel.reveal(column);
      return;
    }

    const mediaRoot = vscode.Uri.joinPath(extensionUri, 'media');
    const panel = vscode.window.createWebviewPanel(
      HomePanel.viewType,
      'CRUXIDE Home',
      column,
      { enableScripts: true, localResourceRoots: [mediaRoot] },
    );

    HomePanel.current = new HomePanel(panel, extensionUri, extensionVersion);
  }

  private readonly disposables: vscode.Disposable[] = [];

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    extensionVersion: string,
  ) {
    this.panel.iconPath = vscode.Uri.joinPath(extensionUri, 'media', 'crux-logo.png');
    this.panel.webview.html = this.getHtml(this.panel.webview, extensionUri, extensionVersion);

    this.panel.onDidDispose(
      () => {
        HomePanel.current = undefined;
        this.dispose();
      },
      undefined,
      this.disposables,
    );

    this.panel.webview.onDidReceiveMessage(
      async (message: unknown) => {
        if (!isHomeMessage(message)) {
          return;
        }

        try {
          await executeHomeCommand(message.command);
        } catch (error: unknown) {
          const detail = error instanceof Error ? error.message : String(error);
          void vscode.window.showErrorMessage(`CRUXIDE could not run that action: ${detail}`);
        }
      },
      undefined,
      this.disposables,
    );
  }

  private dispose(): void {
    for (const disposable of this.disposables.splice(0)) {
      disposable.dispose();
    }
  }

  private getHtml(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    extensionVersion: string,
  ): string {
    const mediaRoot = vscode.Uri.joinPath(extensionUri, 'media');
    const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'crux-mark.svg'));
    const heroUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'crux-home-4k.png'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'home.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'home.js'));
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource}`,
      `style-src ${webview.cspSource}`,
      `font-src ${webview.cspSource}`,
      `script-src ${webview.cspSource}`,
      "base-uri 'none'",
      "form-action 'none'",
    ].join('; ');

    return /* html */ `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="${escapeAttribute(csp)}" />
    <link rel="stylesheet" href="${escapeAttribute(styleUri.toString())}" />
    <title>CRUXIDE Home</title>
  </head>
  <body>
    <div class="grid" aria-hidden="true"></div>
    <main>
      <section class="hero" aria-labelledby="cruxide-title">
        <div class="logo-shell">
          <img src="${escapeAttribute(logoUri.toString())}" alt="CRUX logo" />
        </div>
        <p class="eyebrow">The CRUXCODE developer experience</p>
        <h1 id="cruxide-title">Build with intent.<br /><span class="accent">Ship with confidence.</span></h1>
        <p class="subtitle">CRUXIDE brings architecture-first defaults, focused tooling, and the CRUXCODE visual system into your daily engineering workspace.</p>
        <div class="actions">
          <button type="button" data-command="openFolder">Open Project</button>
          <button type="button" class="secondary" data-command="newFile">New Code File</button>
          <button type="button" class="secondary" data-command="commands">Command Palette</button>
          <button type="button" class="secondary" data-command="extensions">Developer Tools</button>
        </div>
      </section>
      <section class="skills-intro" aria-labelledby="skills-title">
        <div>
          <p class="section-label">One catalog • Every agent</p>
          <h2 id="skills-title">CRUX Skills</h2>
          <p>Choose focused skills for security, architecture, frontend, UI, native mobile, backend, DevOps, AI, code review, and optional engineering rules. Install them for Codex, Claude Code, GitHub Copilot, Cursor, Gemini, or another agent—without adding application runtime dependencies.</p>
        </div>
        <button type="button" data-command="skills">Open Skills Manager</button>
      </section>
      <section class="principles" aria-label="CRUXCODE principles">
        <div class="principle"><strong>Architecture-first</strong><span>Design for real-world complexity and scale.</span></div>
        <div class="principle"><strong>Connected knowledge</strong><span>Keep engineering context close to the code.</span></div>
        <div class="principle"><strong>Scalable delivery</strong><span>Move from idea to impact with confidence.</span></div>
        <div class="principle"><strong>Enterprise-ready</strong><span>Security, governance, and reliability built in.</span></div>
      </section>
      <section class="about" aria-labelledby="about-title">
        <div class="about-copy">
          <p class="section-label">Developed by CRUX Team</p>
          <h2 id="about-title">About CRUXIDE</h2>
          <p>CRUXIDE is a curated developer experience built on Visual Studio Code. It brings architecture-first defaults, focused tooling, and the CRUXCODE visual system into one consistent workspace—helping developers build with intent and ship with confidence.</p>
          <div class="about-actions">
            <button type="button" data-command="website">Visit CRUXCODE</button>
            <button type="button" class="secondary" data-command="linkedin">LinkedIn</button>
          </div>
        </div>
        <article class="founder-card" aria-labelledby="founder-name">
          <p class="section-label">Founder</p>
          <h3 id="founder-name">Mohamed Khaled Abdelfattah</h3>
          <p class="founder-role">Frontend Lead • Architect • Staff Frontend Engineer</p>
          <p>9+ years of experience building and scaling enterprise applications across telecom, banking, fintech, and government sectors, specializing in Angular, React, TypeScript, Micro Frontends, frontend architecture, performance, and technical leadership.</p>
        </article>
      </section>
      <section class="brand-visual" aria-label="CRUXCODE brand experience">
        <img
          src="${escapeAttribute(heroUri.toString())}"
          alt="CRUXCODE — Code Together. Ship Further."
          width="3840"
          height="2160"
          loading="lazy"
          decoding="async"
        />
      </section>
      <footer>
        <span>People • Ideas • Agents • Systems • A brighter tomorrow</span>
        <span>CRUXIDE v${escapeHtml(extensionVersion)} • © 2026 CRUX Team</span>
      </footer>
    </main>
    <script src="${escapeAttribute(scriptUri.toString())}"></script>
  </body>
</html>`;
  }
}

async function executeHomeCommand(command: HomeCommand): Promise<void> {
  switch (command) {
    case 'commands':
      await vscode.commands.executeCommand('workbench.action.showCommands');
      break;
    case 'extensions':
      await vscode.commands.executeCommand('workbench.view.extensions');
      break;
    case 'linkedin':
      await vscode.env.openExternal(LINKEDIN_URL);
      break;
    case 'newFile':
      await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
      break;
    case 'openFolder':
      await vscode.commands.executeCommand('workbench.action.files.openFolder');
      break;
    case 'skills':
      await vscode.commands.executeCommand('cruxide.openSkills');
      break;
    case 'website':
      await vscode.env.openExternal(CRUXCODE_URL);
      break;
  }
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
