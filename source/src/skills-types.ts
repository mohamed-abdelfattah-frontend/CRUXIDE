export const AGENT_IDS = ['codex', 'claude-code', 'copilot', 'cursor', 'gemini', 'generic'] as const;
export const SKILL_SCOPES = ['project-local', 'project-shared', 'user'] as const;
export const RULE_MODES = ['guidance', 'warning', 'strict', 'custom'] as const;

export type AgentId = (typeof AGENT_IDS)[number];
export type SkillScope = (typeof SKILL_SCOPES)[number];
export type RuleMode = (typeof RULE_MODES)[number];

export interface SkillPermissions {
  readonly filesystem: string;
  readonly network: boolean;
  readonly scripts: boolean;
  readonly hooks: boolean;
  readonly authentication: boolean;
}

export interface SkillCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly kind: 'skill' | 'rule-pack';
  readonly source: 'crux' | 'external';
  readonly status: string;
  readonly agents: readonly AgentId[];
  readonly permissions: SkillPermissions;
  readonly benefits: readonly string[];
  readonly useCases: readonly string[];
  readonly tags: readonly string[];
  readonly required?: boolean;
  readonly explicitOnly?: boolean;
  readonly tagline?: string;
  readonly intellectualProperty?: {
    readonly owner: string;
    readonly role: string;
    readonly profile: string;
    readonly scope: string;
  };
  readonly sourceUrl?: string;
  readonly installCommand?: string;
  readonly version: string;
  readonly license: string;
}

export interface SkillsCatalog {
  readonly schemaVersion: number;
  readonly categories: readonly string[];
  readonly skills: readonly SkillCatalogEntry[];
}

export interface SkillInstallRequest {
  readonly skillIds: readonly string[];
  readonly agents: readonly AgentId[];
  readonly scope: SkillScope;
  readonly ruleMode: RuleMode;
}
