import { readFile } from 'node:fs/promises';
import * as vscode from 'vscode';
import { AGENT_IDS, type SkillCatalogEntry, type SkillsCatalog } from './skills-types.js';

const SAFE_ID = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const agents = new Set<string>(AGENT_IDS);

export async function loadSkillsCatalog(extensionUri: vscode.Uri): Promise<SkillsCatalog> {
  const path = vscode.Uri.joinPath(extensionUri, 'skills', 'catalog.json').fsPath;
  const parsed: unknown = JSON.parse(await readFile(path, 'utf8'));
  if (!isRecord(parsed) || parsed.schemaVersion !== 1 || !Array.isArray(parsed.categories) || !Array.isArray(parsed.skills)) {
    throw new Error('The bundled skills catalog is invalid. Reinstall CRUXIDE.');
  }

  const categories = parsed.categories.filter((item): item is string => typeof item === 'string');
  if (categories.length !== parsed.categories.length || !parsed.skills.every(isCatalogEntry)) {
    throw new Error('The bundled skills catalog failed validation.');
  }

  const skillEntries = parsed.skills;
  if (new Set(skillEntries.map((skill) => skill.id)).size !== skillEntries.length) {
    throw new Error('The bundled skills catalog contains duplicate identifiers.');
  }

  return { schemaVersion: 1, categories, skills: skillEntries };
}

function isCatalogEntry(value: unknown): value is SkillCatalogEntry {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.id === 'string'
    && SAFE_ID.test(value.id)
    && typeof value.name === 'string'
    && typeof value.category === 'string'
    && typeof value.description === 'string'
    && (value.kind === 'skill' || value.kind === 'rule-pack')
    && (value.source === 'crux' || value.source === 'external')
    && (value.lastReviewed === undefined || (typeof value.lastReviewed === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.lastReviewed)))
    && (value.versionPolicy === undefined || typeof value.versionPolicy === 'string')
    && (value.references === undefined || (Array.isArray(value.references)
      && value.references.every((reference) => typeof reference === 'string' && reference.startsWith('https://'))))
    && Array.isArray(value.agents)
    && value.agents.every((agent) => typeof agent === 'string' && agents.has(agent));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
