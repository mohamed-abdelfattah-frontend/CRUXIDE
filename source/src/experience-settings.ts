/**
 * The CRUXIDE-owned settings and the logic that writes them.
 *
 * This module deliberately does not import `vscode`, so the partial-failure
 * behaviour can be exercised at runtime by a test that supplies its own writer
 * instead of asserting on source text.
 */

const CODE_FONT_STACK = "'Roboto Mono', Consolas, 'Courier New', monospace";

export interface OwnedSetting {
  readonly section: string;
  readonly key: string;
  readonly value: unknown;
}

/**
 * Settings CRUXIDE owns. Applying the experience writes exactly these and
 * nothing else, so unrelated user configuration is never overwritten.
 */
export const OWNED_SETTINGS: readonly OwnedSetting[] = [
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

/** Writes one setting. Rejecting must not prevent the remaining writes. */
export type SettingWriter = (setting: OwnedSetting) => Promise<void>;

/**
 * Write every owned setting, collecting failures rather than throwing.
 *
 * Each write is attempted independently and a rejection is recorded, so one
 * unwritable setting cannot abort the rest or be mistaken for a full success.
 */
export async function writeOwnedSettings(
  write: SettingWriter,
  settings: readonly OwnedSetting[] = OWNED_SETTINGS,
): Promise<ExperienceResult> {
  const failed: { setting: string; detail: string }[] = [];

  await Promise.all(settings.map(async (setting) => {
    try {
      await write(setting);
    } catch (error: unknown) {
      failed.push({
        setting: `${setting.section}.${setting.key}`,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }));

  return { applied: failed.length === 0, failed };
}

export function describeExperienceFailure(result: ExperienceResult): string {
  return result.failed.map((item) => `${item.setting} (${item.detail})`).join(', ');
}
