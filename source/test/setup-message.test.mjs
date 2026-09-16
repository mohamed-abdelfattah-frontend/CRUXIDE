import assert from 'node:assert/strict';
import test from 'node:test';
import { isSetupMessage } from '../dist/setup-message.js';

const valid = {
  command: 'apply',
  request: {
    trackIds: ['core', 'frontend-angular'],
    agents: ['codex'],
    scope: 'project-local',
    ruleMode: 'guidance',
    profileTarget: 'current',
  },
};

test('accepts strict setup messages', () => {
  assert.equal(isSetupMessage({ command: 'ready' }), true);
  assert.equal(isSetupMessage({ command: 'openProfiles' }), true);
  assert.equal(isSetupMessage(valid), true);
});

test('rejects duplicate, unsafe, oversized, and unknown setup input', () => {
  assert.equal(isSetupMessage({ ...valid, extra: true }), false);
  assert.equal(isSetupMessage({ ...valid, request: { ...valid.request, trackIds: ['core', 'core'] } }), false);
  assert.equal(isSetupMessage({ ...valid, request: { ...valid.request, trackIds: ['../core'] } }), false);
  assert.equal(isSetupMessage({ ...valid, request: { ...valid.request, profileTarget: 'shell' } }), false);
  assert.equal(isSetupMessage({ ...valid, request: { ...valid.request, trackIds: Array.from({ length: 65 }, (_, index) => `track-${index}`) } }), false);
});
