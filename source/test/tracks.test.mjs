import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { extensionPlan, resolveTracks, skillPlan, TRACKS_CATALOG } from '../dist/tracks-catalog.js';

const root = new URL('../', import.meta.url);

test('track catalog is unique, all-selectable, and maps only known skills', async () => {
  const skills = JSON.parse(await readFile(new URL('skills/catalog.json', root), 'utf8'));
  const knownSkills = new Set(skills.skills.map((skill) => skill.id));
  assert.ok(TRACKS_CATALOG.tracks.length >= 20);
  assert.equal(new Set(TRACKS_CATALOG.tracks.map((track) => track.id)).size, TRACKS_CATALOG.tracks.length);
  const all = resolveTracks(TRACKS_CATALOG.tracks.map((track) => track.id));
  const mappedSkills = skillPlan(all);
  for (const id of mappedSkills) assert.ok(knownSkills.has(id), `Unknown mapped skill: ${id}`);
  assert.deepEqual(new Set(mappedSkills), knownSkills, 'All-track default must include the complete skills catalog');
  const extensionIds = extensionPlan(all, 'win32').map((item) => item.id.toLowerCase());
  assert.equal(new Set(extensionIds).size, extensionIds.length);
  assert.ok(extensionIds.includes('jetbrains.kotlin-server'));
  assert.ok(extensionIds.includes('ms-python.python'));
  assert.ok(!extensionIds.includes('sweetpad.sweetpad'));
});

test('iOS-only integrations are filtered by platform', () => {
  const tracks = resolveTracks(['mobile-ios']);
  assert.ok(extensionPlan(tracks, 'darwin').some((item) => item.id === 'sweetpad.sweetpad'));
  assert.ok(!extensionPlan(tracks, 'linux').some((item) => item.id === 'sweetpad.sweetpad'));
});
