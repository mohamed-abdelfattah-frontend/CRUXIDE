import {
  AGENT_IDS,
  RULE_MODES,
  SKILL_SCOPES,
  type AgentId,
  type RuleMode,
  type SkillInstallRequest,
  type SkillScope,
} from './skills-types.js';

const MAX_SELECTIONS = 100;
const SAFE_ID = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const agentIds = new Set<string>(AGENT_IDS);
const scopes = new Set<string>(SKILL_SCOPES);
const ruleModes = new Set<string>(RULE_MODES);

export type SkillsMessage =
  | { readonly command: 'ready' }
  | { readonly command: 'install'; readonly request: SkillInstallRequest }
  | { readonly command: 'uninstall'; readonly request: SkillInstallRequest }
  | { readonly command: 'copyGuide'; readonly request: SkillInstallRequest }
  | { readonly command: 'openReadme'; readonly skillId: string };

export function isSkillsMessage(value: unknown): value is SkillsMessage {
  if (!isRecord(value) || typeof value.command !== 'string') {
    return false;
  }

  if (value.command === 'ready') {
    return hasOnlyKeys(value, ['command']);
  }

  if (value.command === 'openReadme') {
    return hasOnlyKeys(value, ['command', 'skillId']) && isSafeId(value.skillId);
  }

  if (value.command === 'install' || value.command === 'uninstall' || value.command === 'copyGuide') {
    return hasOnlyKeys(value, ['command', 'request']) && isInstallRequest(value.request);
  }

  return false;
}

function isInstallRequest(value: unknown): value is SkillInstallRequest {
  if (!isRecord(value) || !hasOnlyKeys(value, ['skillIds', 'agents', 'scope', 'ruleMode'])) {
    return false;
  }

  return isUniqueArray(value.skillIds, isSafeId)
    && isUniqueArray(value.agents, (item): item is AgentId => typeof item === 'string' && agentIds.has(item))
    && typeof value.scope === 'string'
    && scopes.has(value.scope)
    && typeof value.ruleMode === 'string'
    && ruleModes.has(value.ruleMode);
}

function isUniqueArray<T>(value: unknown, predicate: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value)
    && value.length > 0
    && value.length <= MAX_SELECTIONS
    && value.every(predicate)
    && new Set(value).size === value.length;
}

function isSafeId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_ID.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
  const allowedKeys = new Set(allowed);
  return Object.keys(value).every((key) => allowedKeys.has(key))
    && allowed.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

export function asScope(value: string): SkillScope | undefined {
  return scopes.has(value) ? value as SkillScope : undefined;
}

export function asRuleMode(value: string): RuleMode | undefined {
  return ruleModes.has(value) ? value as RuleMode : undefined;
}
