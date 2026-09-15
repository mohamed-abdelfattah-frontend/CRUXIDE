import assert from 'node:assert/strict';
import test from 'node:test';
import { isSkillsMessage } from '../dist/skills-message.js';

const validRequest = {
  skillIds: ['crux-secure-coding', 'crux-eslint-recommended'],
  agents: ['codex', 'copilot'],
  scope: 'project-local',
  ruleMode: 'guidance',
};

test('accepts strict Skills Manager messages', () => {
  assert.equal(isSkillsMessage({ command: 'ready' }), true);
  assert.equal(isSkillsMessage({ command: 'openReadme', skillId: 'crux-secure-coding' }), true);
  assert.equal(isSkillsMessage({ command: 'install', request: validRequest }), true);
  assert.equal(isSkillsMessage({ command: 'uninstall', request: validRequest }), true);
  assert.equal(isSkillsMessage({ command: 'copyGuide', request: validRequest }), true);
});

test('rejects unsafe, duplicate, unknown-shape, and oversized requests', () => {
  const invalid = [
    { command: 'ready', extra: true },
    { command: 'openReadme', skillId: '../secret' },
    { command: 'install', request: { ...validRequest, skillIds: [] } },
    { command: 'install', request: { ...validRequest, skillIds: ['same', 'same'] } },
    { command: 'install', request: { ...validRequest, agents: ['shell'] } },
    { command: 'install', request: { ...validRequest, scope: '../../tmp' } },
    { command: 'install', request: { ...validRequest, ruleMode: 'enforced-without-consent' } },
    { command: 'install', request: { ...validRequest, extra: true } },
    { command: 'install', request: { ...validRequest, skillIds: Array.from({ length: 101 }, (_, index) => `skill-${index}`) } },
  ];
  invalid.forEach((message) => assert.equal(isSkillsMessage(message), false));
});
