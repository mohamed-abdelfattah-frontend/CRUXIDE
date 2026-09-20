import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { fakeCatalog, loadSetupWebview } from './helpers/dom.mjs';

const root = new URL('../', import.meta.url);
const scriptPath = fileURLToPath(new URL('media/setup.js', root));

/**
 * Regression coverage for the track-selection scroll jump.
 *
 * The bug was a full `render()` on every selection change. `render()` calls
 * `list.replaceChildren()`, which detaches every node, so the webview loses
 * scroll position and keyboard focus and the page jumps to the top.
 *
 * These tests execute media/setup.js against a small DOM harness and assert on
 * node identity: after a selection change the original input elements must
 * still be the same, still-attached objects. Matching source text could not
 * distinguish that from a rebuild that happens to produce similar markup.
 */
async function mountedWebview(trackCount = 6) {
  const view = await loadSetupWebview(scriptPath);
  view.postToWebview({
    command: 'setupData',
    catalog: fakeCatalog(trackCount),
    environment: { platform: 'win32', hasWorkspace: true, trusted: true },
  });
  return view;
}

test('the webview asks for data and renders one input per track', async () => {
  const view = await mountedWebview();

  assert.deepEqual(view.posted, [{ command: 'ready' }], 'must request data, and install nothing');
  assert.equal(view.trackInputs().length, 6);
  assert.ok(view.trackInputs().every((input) => input.checked), 'all tracks start selected');
  assert.equal(view.trackInputs()[0].disabled, true, 'a required track cannot be deselected');
});

test('toggling a track keeps the existing nodes attached', async () => {
  const view = await mountedWebview();
  const before = view.trackInputs();
  const target = before[4];

  target.checked = false;
  target.dispatchEvent('change');

  const after = view.trackInputs();
  assert.equal(after.length, before.length);
  for (const [i, input] of before.entries()) {
    assert.equal(after[i], input, `input ${i} must be the same node, not a rebuilt one`);
    assert.equal(input.isConnected, true, `input ${i} must stay attached to the document`);
  }
});

test('deselecting then reselecting updates the summary without rebuilding', async () => {
  const view = await mountedWebview();
  const summary = view.element('summary');
  const target = view.trackInputs()[3];
  const identity = view.trackInputs();

  target.checked = false;
  target.dispatchEvent('change');
  const afterDeselect = summary.textContent;
  assert.match(afterDeselect, /^5 tracks/, 'summary must reflect the deselection');

  target.checked = true;
  target.dispatchEvent('change');
  assert.match(summary.textContent, /^6 tracks/, 'summary must reflect the reselection');

  assert.deepEqual(view.trackInputs(), identity, 'no node was replaced across either toggle');
});

test('Select all and Core only sync the existing inputs in place', async () => {
  const view = await mountedWebview();
  const identity = view.trackInputs();

  view.click('core');
  assert.deepEqual(view.trackInputs(), identity, 'Core only must not rebuild the list');
  assert.equal(view.trackInputs().filter((i) => i.checked).length, 1, 'only the required track stays');
  assert.match(view.element('summary').textContent, /^1 tracks/);

  view.click('all');
  assert.deepEqual(view.trackInputs(), identity, 'Select all must not rebuild the list');
  assert.ok(view.trackInputs().every((i) => i.checked), 'every track is selected again');
  assert.match(view.element('summary').textContent, /^6 tracks/);
});

test('search filtering rebuilds the list, which is correct and only happens there', async () => {
  const view = await mountedWebview();
  const before = view.trackInputs();

  const search = view.element('search');
  search.value = 'Track 2';
  search.dispatchEvent('input');

  const after = view.trackInputs();
  assert.equal(after.length, 1, 'filtering must narrow the visible tracks');
  assert.notEqual(after[0], before[2], 'a filter legitimately rebuilds the list');

  // Selection state survives the rebuild, and focus stays in the search box.
  assert.equal(after[0].checked, true);

  search.value = '';
  search.dispatchEvent('input');
  assert.equal(view.trackInputs().length, 6, 'clearing the filter restores every track');
});

test('a selection made while filtered survives clearing the filter', async () => {
  const view = await mountedWebview();

  const search = view.element('search');
  search.value = 'Track 5';
  search.dispatchEvent('input');

  const filtered = view.trackInputs();
  assert.equal(filtered.length, 1);
  filtered[0].checked = false;
  filtered[0].dispatchEvent('change');

  search.value = '';
  search.dispatchEvent('input');

  const restored = view.trackInputs();
  assert.equal(restored.length, 6);
  assert.equal(restored[5].checked, false, 'the deselection must persist through the rebuild');
  assert.equal(restored.filter((i) => i.checked).length, 5);
});

test('apply sends the selected tracks and never installs on load', async () => {
  const view = await mountedWebview();

  view.trackInputs()[2].checked = false;
  view.trackInputs()[2].dispatchEvent('change');
  view.click('apply');

  const apply = view.posted.find((m) => m.command === 'apply');
  assert.ok(apply, 'apply must post a request');
  assert.equal(apply.request.trackIds.length, 5);
  assert.ok(!apply.request.trackIds.includes('track-2'));
  assert.deepEqual(apply.request.agents, ['codex']);
  assert.equal(apply.request.scope, 'project-local');
  assert.equal(apply.request.profileTarget, 'current');

  // Nothing may be requested before the user pressed apply.
  assert.equal(view.posted[0].command, 'ready');
});

test('apply is refused when no track is selected', async () => {
  const view = await mountedWebview();

  view.click('core');
  view.trackInputs()[0].checked = false;
  view.trackInputs()[0].dispatchEvent('change');
  view.click('apply');

  assert.ok(!view.posted.some((m) => m.command === 'apply'), 'must not post an empty plan');
  assert.match(view.element('status').textContent, /Select at least one track/);
});

test('the track list stays an announced live region', async () => {
  const panel = await readFile(new URL('src/setup-panel.ts', root), 'utf8');
  assert.match(panel, /id="track-list"[^>]*aria-live="polite"/);
  assert.match(panel, /id="status" role="status"/);
});

test('keyboard focus survives a track toggle', async () => {
  const view = await mountedWebview();
  const target = view.trackInputs()[4];

  target.focus();
  assert.equal(view.activeElement(), target, 'precondition: the input holds focus');

  target.checked = false;
  target.dispatchEvent('change');

  assert.equal(view.activeElement(), target, 'toggling must not move keyboard focus');
  assert.equal(view.isFocusLost(), false);
});

test('the harness does detect focus loss, so the assertions above are not vacuous', async () => {
  const view = await mountedWebview();
  const target = view.trackInputs()[3];
  target.focus();

  // Filtering legitimately rebuilds the list, which detaches the focused input.
  // A browser resets activeElement to <body> here, and so must the harness —
  // otherwise "focus survives a toggle" could never fail.
  const search = view.element('search');
  search.value = 'Track 1';
  search.dispatchEvent('input');

  assert.notEqual(view.activeElement(), target, 'a detached node cannot keep focus');
  assert.equal(view.isFocusLost(), true, 'focus falls back to the document body');
});

test('keyboard focus survives Select all and Core only', async () => {
  const view = await mountedWebview();
  const target = view.trackInputs()[2];
  target.focus();

  view.click('core');
  assert.equal(view.activeElement(), target, 'Core only must not move focus');

  view.click('all');
  assert.equal(view.activeElement(), target, 'Select all must not move focus');
});

test('focus stays in the search box across applying and clearing a filter', async () => {
  const view = await mountedWebview();
  const search = view.element('search');

  search.focus();
  search.value = 'Track 3';
  search.dispatchEvent('input');
  assert.equal(view.activeElement(), search, 'focus must stay in the search box while filtering');

  search.value = '';
  search.dispatchEvent('input');
  assert.equal(view.activeElement(), search, 'focus must stay in the search box when cleared');
  assert.equal(view.isFocusLost(), false);
});

test('scroll position survives a track toggle and the bulk controls', async () => {
  const view = await mountedWebview();
  const list = view.element('track-list');

  // The user has scrolled down to a track low on the page.
  list.scrollTop = 420;

  const target = view.trackInputs()[4];
  target.checked = false;
  target.dispatchEvent('change');
  assert.equal(list.scrollTop, 420, 'toggling must not scroll the list back to the top');

  view.click('core');
  assert.equal(list.scrollTop, 420, 'Core only must not scroll the list back to the top');

  view.click('all');
  assert.equal(list.scrollTop, 420, 'Select all must not scroll the list back to the top');
});

test('the harness does detect scroll loss, so the assertion above is not vacuous', async () => {
  const view = await mountedWebview();
  const list = view.element('track-list');
  list.scrollTop = 420;

  // Filtering legitimately rebuilds the list. A browser resets a scroll
  // container when its content is replaced, and so must the harness, or
  // 'scroll survives a toggle' could never fail.
  const search = view.element('search');
  search.value = 'Track 1';
  search.dispatchEvent('input');

  assert.equal(list.scrollTop, 0, 'replacing the content resets the scroll container');
});
