import * as vscode from 'vscode';
import { ActionsProvider } from './actions-provider.js';
import { hasCodeFiles } from './code-files.js';
import { HomePanel } from './home-panel.js';
import { getSetupState } from './setup-installer.js';
import { SetupPanel } from './setup-panel.js';
import { SkillsPanel } from './skills-panel.js';

const EXPERIENCE_PROMPTED_KEY = 'cruxide.experiencePrompted.v3';
const SETUP_PROMPTED_KEY = 'cruxide.setupPrompted.v2';
const CODE_FONT_STACK = "'Roboto Mono', Consolas, 'Courier New', monospace";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const output = vscode.window.createOutputChannel('CRUXIDE');
  const actionsProvider = new ActionsProvider();
  const extensionVersion = getExtensionVersion(context);

  context.subscriptions.push(
    output,
    vscode.window.registerTreeDataProvider('cruxide.actions', actionsProvider),
    vscode.commands.registerCommand('cruxide.openHome', () =>
      HomePanel.show(context.extensionUri, extensionVersion)),
    vscode.commands.registerCommand('cruxide.openSkills', async () => {
      await runUserAction(output, 'Open Skills Manager', () => SkillsPanel.show(context, output));
    }),
    vscode.commands.registerCommand('cruxide.openSetup', async () => {
      await runUserAction(output, 'Open Setup', () => Promise.resolve(SetupPanel.show(context, output)));
    }),
    vscode.commands.registerCommand('cruxide.applyExperience', async () => {
      await runUserAction(output, 'Apply experience', async () => {
        await applyExperience();
        await context.globalState.update(EXPERIENCE_PROMPTED_KEY, true);
        void vscode.window.showInformationMessage('CRUXIDE experience applied to this profile.');
      });
    }),
    vscode.commands.registerCommand('cruxide.newFile', async () => {
      await runUserAction(output, 'Create file', async () => {
        await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
      });
    }),
    vscode.commands.registerCommand('cruxide.openFolder', async () => {
      await runUserAction(output, 'Open folder', async () => {
        await vscode.commands.executeCommand('workbench.action.files.openFolder');
      });
    }),
    vscode.commands.registerCommand('cruxide.openExtensions', async () => {
      await runUserAction(output, 'Open extensions', async () => {
        await vscode.commands.executeCommand('workbench.view.extensions');
      });
    }),
  );

  let setupOpened = false;
  try {
    setupOpened = await openFirstRunSetup(context, output);
  } catch (error: unknown) {
    output.appendLine(`First-run setup failed: ${formatError(error)}`);
  }

  if (!setupOpened) {
    try {
      await openHomeWhenEmpty(context, extensionVersion);
    } catch (error: unknown) {
      output.appendLine(`Home detection failed: ${formatError(error)}`);
    }
  }
}

async function openFirstRunSetup(
  context: vscode.ExtensionContext,
  output: vscode.OutputChannel,
): Promise<boolean> {
  const alreadyPrompted = context.globalState.get<boolean>(SETUP_PROMPTED_KEY, false);
  const shouldPrompt = vscode.workspace
    .getConfiguration('cruxide')
    .get<boolean>('promptToOpenSetupOnFirstRun', true);
  if (alreadyPrompted || !shouldPrompt || getSetupState(context)) return false;

  await context.globalState.update(SETUP_PROMPTED_KEY, true);
  SetupPanel.show(context, output);
  output.appendLine('Opened first-run track selection. No tools are installed until the user confirms the plan.');
  return true;
}

export async function applyExperience(): Promise<void> {
  await Promise.all([
    vscode.workspace.getConfiguration('workbench').update(
      'colorTheme', 'CRUXIDE Dark', vscode.ConfigurationTarget.Global,
    ),
    vscode.workspace.getConfiguration('workbench').update(
      'iconTheme', 'material-icon-theme', vscode.ConfigurationTarget.Global,
    ),
    vscode.workspace.getConfiguration('window').update(
      'title',
      'CRUXIDE — ${rootName}${separator}${activeEditorShort}',
      vscode.ConfigurationTarget.Global,
    ),
    vscode.workspace.getConfiguration('editor').update(
      'fontLigatures', true, vscode.ConfigurationTarget.Global,
    ),
    vscode.workspace.getConfiguration('editor').update(
      'fontFamily', CODE_FONT_STACK, vscode.ConfigurationTarget.Global,
    ),
    vscode.workspace.getConfiguration('terminal.integrated').update(
      'fontFamily', "'Roboto Mono'", vscode.ConfigurationTarget.Global,
    ),
  ]);
}

async function openHomeWhenEmpty(
  context: vscode.ExtensionContext,
  extensionVersion: string,
): Promise<void> {
  const shouldOpen = vscode.workspace
    .getConfiguration('cruxide')
    .get<boolean>('openHomeOnEmpty', true);

  if (shouldOpen && !(await hasCodeFiles())) {
    HomePanel.show(context.extensionUri, extensionVersion);
  }
}

function getExtensionVersion(context: vscode.ExtensionContext): string {
  const packageJson: unknown = context.extension.packageJSON;
  const version =
    typeof packageJson === 'object' && packageJson !== null && 'version' in packageJson
      ? (packageJson as { readonly version?: unknown }).version
      : undefined;
  return typeof version === 'string' && /^\d+\.\d+\.\d+$/.test(version) ? version : 'unknown';
}

async function runUserAction(
  output: vscode.OutputChannel,
  label: string,
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } catch (error: unknown) {
    const detail = formatError(error);
    output.appendLine(`${label} failed: ${detail}`);
    void vscode.window.showErrorMessage(`CRUXIDE: ${label} failed. ${detail}`);
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
