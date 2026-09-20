import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readText = (path) => readFile(new URL(path, root), 'utf8');

/**
 * Regression coverage for the track-selection scroll jump.
 *
 * The bug was a full `render()` (which calls `list.replaceChildren()`) on every
 * selection change. Rebuilding the list detaches every node, so the webview
 * loses scroll position and keyboard focus and the page jumps to the top. The
 * fix mutates the existing inputs instead. These tests pin that contract so a
 * future edit cannot reintroduce the re-render without failing.
 */
test('selection changes mutate existing inputs instead of rebuilding the list', async () => {
  const script = await readText('media/setup.js');

  // Only search filtering may rebuild the list, because a filter genuinely
  // changes which tracks exist and focus stays in the search box.
  const rerenderCallers = [...script.matchAll(/^\s*(.*\brender\(\).*)$/gm)]
    .map((match) => match[1].trim())
    .filter((line) => !line.startsWith('function render'));

  for (const line of rerenderCallers) {
    const isInitialLoad = line === 'render();';
    const isSearchFilter = line.includes("search.addEventListener('input', render)");
    assert.ok(
      isInitialLoad || isSearchFilter,
      `render() may only run on initial load or search filtering, found: ${line}`,
    );
  }

  assert.ok(
    script.includes('function syncTrackInputs()'),
    'selection helpers must sync existing inputs in place',
  );
  assert.match(
    script,
    /syncTrackInputs\(\)\s*\{[\s\S]*?list\.querySelectorAll\('input\[data-track-id\]'\)[\s\S]*?\.checked = state\.selected\.has/,
    'syncTrackInputs must update the checked state of existing inputs, not recreate them',
  );
});

test('individual track toggle updates state and summary without re-rendering', async () => {
  const script = await readText('media/setup.js');
  const handler = script.match(
    /input\.addEventListener\('change', \(\) => \{([\s\S]*?)\}\);/,
  );

  assert.ok(handler, 'track checkbox change handler must exist');
  const body = handler[1];
  assert.match(body, /state\.selected\.(add|delete)/, 'toggle must update selection state');
  assert.match(body, /updateSummary\(\)/, 'toggle must refresh the summary');
  assert.doesNotMatch(body, /\brender\(\)/, 'toggle must not rebuild the track list');
  assert.doesNotMatch(body, /replaceChildren|innerHTML/, 'toggle must not detach existing nodes');
});

test('Select all and Core only preserve position by syncing inputs in place', async () => {
  const script = await readText('media/setup.js');

  for (const control of ['all', 'core']) {
    const handler = script.match(
      new RegExp(`getElementById\\('${control}'\\)\\.addEventListener\\('click', \\(\\) => \\{([\\s\\S]*?)\\}\\);`),
    );
    assert.ok(handler, `${control} button handler must exist`);
    const body = handler[1];
    assert.match(body, /syncTrackInputs\(\)/, `${control} must sync existing inputs`);
    assert.match(body, /updateSummary\(\)/, `${control} must refresh the summary`);
    assert.doesNotMatch(body, /\brender\(\)/, `${control} must not rebuild the track list`);
  }
});

test('track cards keep an addressable id and a disabled state for required tracks', async () => {
  const script = await readText('media/setup.js');

  // syncTrackInputs() addresses inputs by data-track-id, so the attribute is
  // part of the contract that keeps selection updates in place.
  assert.match(script, /input\.dataset\.trackId = track\.id/);
  assert.match(script, /input\.disabled = Boolean\(track\.required\)/);
});

test('the track list announces changes to assistive technology', async () => {
  const panel = await readText('src/setup-panel.ts');
  assert.match(
    panel,
    /id="track-list"[^>]*aria-live="polite"/,
    'the track list must stay an aria-live region so selection changes are announced',
  );
  assert.match(
    panel,
    /id="status" role="status"/,
    'the status line must stay a live status region',
  );
});
