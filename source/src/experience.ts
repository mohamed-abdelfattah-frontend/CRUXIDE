import * as vscode from 'vscode';
import {
  OWNED_SETTINGS,
  writeOwnedSettings,
  type ExperienceResult,
} from './experience-settings.js';

export { describeExperienceFailure } from './experience-settings.js';
export { OWNED_SETTINGS } from './experience-settings.js';
export type { ExperienceResult } from './experience-settings.js';

/**
 * Write the CRUXIDE-owned settings to the active profile.
 *
 * Idempotent: every value is fixed, so re-running converges on the same state.
 * The settings table and the partial-failure handling live in
 * ./experience-settings.ts, which has no vscode dependency and is therefore
 * testable at runtime; this function only supplies the VS Code writer.
 */
export async function applyExperience(): Promise<ExperienceResult> {
  return writeOwnedSettings(
    async ({ section, key, value }) => {
      await vscode.workspace
        .getConfiguration(section)
        .update(key, value, vscode.ConfigurationTarget.Global);
    },
    OWNED_SETTINGS,
  );
}
