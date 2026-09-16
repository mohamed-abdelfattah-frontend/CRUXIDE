import type { AgentId, RuleMode, SkillScope } from './skills-types.js';

export const PROFILE_TARGETS = ['current', 'dedicated'] as const;

export type ProfileTarget = (typeof PROFILE_TARGETS)[number];
export type SupportedPlatform = 'win32' | 'darwin' | 'linux';

export interface TrackExtension {
  readonly id: string;
  readonly name: string;
  readonly platforms?: readonly SupportedPlatform[];
  readonly note?: string;
}

export interface ToolTrack {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly required?: boolean;
  readonly extensions: readonly TrackExtension[];
  readonly skillIds: readonly string[];
  readonly ruleIds: readonly string[];
  readonly prerequisites: readonly string[];
  readonly tags: readonly string[];
}

export interface TracksCatalog {
  readonly schemaVersion: number;
  readonly tracks: readonly ToolTrack[];
}

export interface SetupRequest {
  readonly trackIds: readonly string[];
  readonly agents: readonly AgentId[];
  readonly scope: SkillScope;
  readonly ruleMode: RuleMode;
  readonly profileTarget: ProfileTarget;
}

export interface SetupState {
  readonly schemaVersion: number;
  readonly trackIds: readonly string[];
  readonly extensionIds: readonly string[];
  readonly updatedAt: string;
}
