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

test('accessibility standards are available as a dedicated independently selectable track', () => {
  const track = TRACKS_CATALOG.tracks.find((item) => item.id === 'accessibility-compliance');
  assert.ok(track);
  assert.equal(track.extensions.length, 0);
  for (const ruleId of ['crux-wcag-22-rules', 'crux-bitv-20-rules', 'crux-bfsg-rules']) {
    assert.ok(track.ruleIds.includes(ruleId));
  }
});

test('every supported engineering track maps its technology-specific rule packs', () => {
  const expected = new Map([
    ['frontend-shared', ['crux-web-platform-rules', 'crux-typescript-javascript-rules']],
    ['frontend-angular', ['crux-angular-rules']],
    ['frontend-react', ['crux-react-rules']],
    ['frontend-nextjs', ['crux-nextjs-rules']],
    ['mobile-react-native', ['crux-react-native-rules']],
    ['mobile-android', ['crux-kotlin-android-rules']],
    ['mobile-ios', ['crux-swift-ios-rules']],
    ['mobile-flutter', ['crux-dart-flutter-rules']],
    ['backend-node', ['crux-nodejs-rules']],
    ['backend-express', ['crux-express-rules']],
    ['backend-nestjs', ['crux-nestjs-rules']],
    ['backend-php-laravel', ['crux-php-rules', 'crux-laravel-rules']],
    ['backend-dotnet', ['crux-csharp-dotnet-rules']],
    ['backend-java-spring', ['crux-java-spring-rules']],
    ['backend-go-rust', ['crux-go-rules', 'crux-rust-rules']],
    ['ai-python', ['crux-python-rules', 'crux-ai-rag-production-rules']],
    ['databases', ['crux-sql-database-rules']],
    ['devops-containers', ['crux-container-cicd-rules']],
  ]);
  const byId = new Map(TRACKS_CATALOG.tracks.map((track) => [track.id, track]));
  for (const [trackId, ruleIds] of expected) {
    const track = byId.get(trackId);
    assert.ok(track, `${trackId} must exist`);
    for (const ruleId of ruleIds) assert.ok(track.ruleIds.includes(ruleId), `${trackId} must map ${ruleId}`);
  }
});
