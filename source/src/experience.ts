import * as vscode from 'vscode';

const CODE_FONT_STACK = "'Roboto Mono', Consolas, 'Courier New', monospace";

/**
 * Settings CRUXIDE owns. Applying the experience writes exactly these and
 * nothing else, so unrelated user configuration is never overwritten.
 */
const OWNED_SETTINGS: readonly {
  readonly section: string;
  readonly key: string;
  readonly value: unknown;
}[] = [
  { section: 'workbench', key: 'colorTheme', value: 'CRUXIDE Dark' },
  { section: 'workbench', key: 'iconTheme', value: 'material-icon-theme' },
  { section: 'window', key: 'title', value: 'CRUXIDE — ${rootName}${separator}${activeEditorShort}' },
  { section: 'editor', key: 'fontLigatures', value: true },
  { section: 'editor', key: 'fontFamily', value: CODE_FONT_STACK },
  { section: 'terminal.integrated', key: 'fontFamily', value: "'Roboto Mono'" },
];

export interface ExperienceResult {
  /** True only when every CRUXIDE-owned setting was written. */
  readonly applied: boolean;
  /** Settings that could not be written, with the reason for each. */
  readonly failed: readonly { readonly setting: string; readonly detail: string }[];
}

/**
 * Write the CRUXIDE-owned settings to the active profile.
 *
 * Idempotent: every value is fixed, so re-running converges on the same state.
 * Each setting is written independently and a failure is reported rather than
 * thrown, so one unwritable setting cannot be mistaken for a full success.
 */
export async function applyExperience(): Promise<ExperienceResult> {
  const failed: { setting: string; detail: string }[] = [];

  await Promise.all(OWNED_SETTINGS.map(async ({ section, key, value }) => {
    try {
      await vscode.workspace
        .getConfiguration(section)
        .update(key, value, vscode.ConfigurationTarget.Global);
    } catch (error: unknown) {
      failed.push({
        setting: `${section}.${key}`,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }));

  return { applied: failed.length === 0, failed };
}

export function describeExperienceFailure(result: ExperienceResult): string {
  return result.failed.map((item) => `${item.setting} (${item.detail})`).join(', ');
}
