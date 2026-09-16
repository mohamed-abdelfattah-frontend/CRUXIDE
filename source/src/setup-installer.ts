import * as vscode from 'vscode';
import { loadSkillsCatalog } from './skills-catalog.js';
import { installSkills, type InstallResult } from './skills-installer.js';
import { extensionPlan, resolveTracks, skillPlan } from './tracks-catalog.js';
import type { SetupRequest, SetupState, TrackExtension } from './tracks-types.js';

const SETUP_STATE_KEY = 'cruxide.setupState.v1';

export interface SetupResult {
  readonly tracks: number;
  readonly requestedExtensions: number;
  readonly installedExtensions: readonly string[];
  readonly alreadyInstalledExtensions: readonly string[];
  readonly failedExtensions: readonly { readonly id: string; readonly detail: string }[];
  readonly skippedExtensions: readonly string[];
  readonly skills?: InstallResult;
  readonly skillsDeferred: boolean;
}

export async function applySetup(
  context: vscode.ExtensionContext,
  output: vscode.OutputChannel,
  request: SetupRequest,
): Promise<SetupResult> {
  if (request.profileTarget !== 'current') {
    throw new Error('Switch to the dedicated CRUXIDE profile first, then run CRUXIDE Setup again.');
  }

  const tracks = resolveTracks(request.trackIds);
  const plannedExtensions = extensionPlan(tracks, process.platform);
  const extensionResult = await installExtensions(plannedExtensions, output);
  const catalog = await loadSkillsCatalog(context.extensionUri);
  const skillIds = skillPlan(tracks).filter((id) => catalog.skills.some((skill) => skill.id === id));
  const hasLocalWorkspace = (vscode.workspace.workspaceFolders ?? [])
    .some((folder) => folder.uri.scheme === 'file');
  const skillsDeferred = request.scope !== 'user' && (!hasLocalWorkspace || !vscode.workspace.isTrusted);
  const skills = skillsDeferred
    ? undefined
    : await installSkills(context.extensionUri, catalog, {
      skillIds,
      agents: request.agents,
      scope: request.scope,
      ruleMode: request.ruleMode,
    });

  const previous = getSetupState(context);
  const installedLedger = new Set([
    ...(previous?.extensionIds ?? []),
    ...extensionResult.installed,
  ]);
  const state: SetupState = {
    schemaVersion: 1,
    trackIds: tracks.map((item) => item.id),
    extensionIds: [...installedLedger].sort(),
    updatedAt: new Date().toISOString(),
  };
  await context.globalState.update(SETUP_STATE_KEY, state);

  return {
    tracks: tracks.length,
    requestedExtensions: plannedExtensions.length,
    installedExtensions: extensionResult.installed,
    alreadyInstalledExtensions: extensionResult.existing,
    failedExtensions: extensionResult.failed,
    skippedExtensions: extensionResult.skipped,
    ...(skills ? { skills } : {}),
    skillsDeferred,
  };
}

export function getSetupState(context: vscode.ExtensionContext): SetupState | undefined {
  const value = context.globalState.get<unknown>(SETUP_STATE_KEY);
  if (!isSetupState(value)) return undefined;
  return value;
}

async function installExtensions(
  planned: readonly TrackExtension[],
  output: vscode.OutputChannel,
): Promise<{
  installed: string[];
  existing: string[];
  failed: Array<{ id: string; detail: string }>;
  skipped: string[];
}> {
  const installed: string[] = [];
  const existing: string[] = [];
  const failed: Array<{ id: string; detail: string }> = [];
  const skipped: string[] = [];
  const available = new Set(vscode.extensions.all.map((item) => item.id.toLowerCase()));

  for (const item of planned) {
    const normalized = item.id.toLowerCase();
    if (available.has(normalized) || vscode.extensions.getExtension(item.id)) {
      existing.push(item.id);
      continue;
    }

    try {
      output.appendLine(`Installing track extension: ${item.id}`);
      await vscode.commands.executeCommand('workbench.extensions.installExtension', item.id);
      installed.push(item.id);
      available.add(normalized);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      if (/built-in extension|cannot be downgraded/i.test(detail)) {
        skipped.push(item.id);
        output.appendLine(`Using application-provided extension ${item.id}: ${detail}`);
      } else {
        failed.push({ id: item.id, detail });
        output.appendLine(`Extension ${item.id} failed: ${detail}`);
      }
    }
  }

  return { installed, existing, failed, skipped };
}

function isSetupState(value: unknown): value is SetupState {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const candidate = value as Partial<SetupState>;
  return candidate.schemaVersion === 1
    && Array.isArray(candidate.trackIds)
    && candidate.trackIds.every((id) => typeof id === 'string')
    && Array.isArray(candidate.extensionIds)
    && candidate.extensionIds.every((id) => typeof id === 'string')
    && typeof candidate.updatedAt === 'string';
}
