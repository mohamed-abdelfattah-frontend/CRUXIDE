import {
  AGENT_IDS,
  RULE_MODES,
  SKILL_SCOPES,
  type AgentId,
  type RuleMode,
  type SkillScope,
} from './skills-types.js';
import { PROFILE_TARGETS, type ProfileTarget, type SetupRequest } from './tracks-types.js';

const MAX_TRACKS = 64;
const SAFE_ID = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const agentIds = new Set<string>(AGENT_IDS);
const scopes = new Set<string>(SKILL_SCOPES);
const ruleModes = new Set<string>(RULE_MODES);
const profileTargets = new Set<string>(PROFILE_TARGETS);

export type SetupMessage =
  | { readonly command: 'ready' }
  | { readonly command: 'apply'; readonly request: SetupRequest }
  | { readonly command: 'openProfiles' };

export function isSetupMessage(value: unknown): value is SetupMessage {
  if (!isRecord(value) || typeof value.command !== 'string') return false;
  if (value.command === 'ready' || value.command === 'openProfiles') {
    return hasOnlyKeys(value, ['command']);
  }
  return value.command === 'apply'
    && hasOnlyKeys(value, ['command', 'request'])
    && isSetupRequest(value.request);
}

function isSetupRequest(value: unknown): value is SetupRequest {
  if (!isRecord(value) || !hasOnlyKeys(value, [
    'trackIds', 'agents', 'scope', 'ruleMode', 'profileTarget',
  ])) return false;

  return isUniqueArray(value.trackIds, isSafeId, MAX_TRACKS)
    && isUniqueArray(value.agents, (item): item is AgentId =>
      typeof item === 'string' && agentIds.has(item), AGENT_IDS.length)
    && typeof value.scope === 'string' && scopes.has(value.scope)
    && typeof value.ruleMode === 'string' && ruleModes.has(value.ruleMode)
    && typeof value.profileTarget === 'string' && profileTargets.has(value.profileTarget);
}

function isUniqueArray<T>(
  value: unknown,
  predicate: (item: unknown) => item is T,
  maximum: number,
): value is T[] {
  return Array.isArray(value)
    && value.length > 0
    && value.length <= maximum
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

export function asProfileTarget(value: string): ProfileTarget | undefined {
  return profileTargets.has(value) ? value as ProfileTarget : undefined;
}

export function asScope(value: string): SkillScope | undefined {
  return scopes.has(value) ? value as SkillScope : undefined;
}

export function asRuleMode(value: string): RuleMode | undefined {
  return ruleModes.has(value) ? value as RuleMode : undefined;
}
