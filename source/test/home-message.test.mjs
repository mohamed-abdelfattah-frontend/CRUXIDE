import assert from 'node:assert/strict';
import test from 'node:test';
import { HOME_COMMANDS, isHomeMessage } from '../dist/home-message.js';

test('accepts every documented Home command', () => {
  for (const command of HOME_COMMANDS) {
    assert.equal(isHomeMessage({ command }), true);
  }
});

test('rejects missing, coerced, inherited, and arbitrary commands', () => {
  const invalidMessages = [
    null,
    undefined,
    'openFolder',
    42,
    {},
    { command: 1 },
    { command: true },
    { command: 'workbench.action.terminal.new' },
    { command: { toString: () => 'openFolder' } },
    Object.create({ command: 'openFolder' }),
    Object.assign([], { command: 'openFolder' }),
  ];

  for (const message of invalidMessages) {
    assert.equal(isHomeMessage(message), false);
  }
});
