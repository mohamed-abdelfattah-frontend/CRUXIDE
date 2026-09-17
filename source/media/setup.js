(() => {
  'use strict';
  const vscode = acquireVsCodeApi();
  const agentLabels = { codex: 'Codex', 'claude-code': 'Claude Code', copilot: 'GitHub Copilot', cursor: 'Cursor', gemini: 'Gemini', generic: 'Generic / other' };
  const state = { catalog: null, selected: new Set(), agents: new Set(['codex']), environment: null };
  const list = document.getElementById('track-list');
  const summary = document.getElementById('summary');
  const search = document.getElementById('search');
  const status = document.getElementById('status');
  const environment = document.getElementById('environment');

  const agents = document.getElementById('agents');
  Object.entries(agentLabels).forEach(([id, label]) => {
    const item = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox'; input.value = id; input.checked = id === 'codex';
    input.addEventListener('change', () => input.checked ? state.agents.add(id) : state.agents.delete(id));
    item.append(input, document.createTextNode(label)); agents.append(item);
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.command === 'setupData') {
      state.catalog = message.catalog;
      state.environment = message.environment;
      const saved = message.saved?.trackIds;
      const initial = Array.isArray(saved) && saved.length
        ? saved
        : state.catalog.tracks.map((track) => track.id);
      state.selected = new Set(initial);
      state.catalog.tracks.filter((track) => track.required).forEach((track) => state.selected.add(track.id));
      environment.textContent = describeEnvironment(message.environment);
      render();
    } else if (message.command === 'applied') {
      const result = message.result;
      status.textContent = `Applied ${result.tracks} tracks. Installed ${result.installedExtensions.length} extensions; ${result.alreadyInstalledExtensions.length} were already available.${result.failedExtensions.length ? ` ${result.failedExtensions.length} need manual review.` : ''}${result.skillsDeferred ? ' Project skills and rules are deferred until a trusted local folder is open.' : ' Skills and PROJECT_RULES are ready.'}`;
    } else if (message.command === 'profileRequired') {
      status.textContent = 'Create or switch to the dedicated profile, then reopen this setup. Nothing was installed.';
    } else if (message.command === 'error') {
      status.textContent = message.detail;
    }
  });

  function render() {
    if (!state.catalog) return;
    const term = search.value.trim().toLowerCase();
    const visible = state.catalog.tracks.filter((track) => !term || `${track.name} ${track.description} ${track.tags.join(' ')}`.toLowerCase().includes(term));
    list.replaceChildren();
    const groups = new Map();
    visible.forEach((track) => { const group = groups.get(track.category) || []; group.push(track); groups.set(track.category, group); });
    groups.forEach((tracks, name) => {
      const section = document.createElement('section'); section.className = 'track-group';
      const heading = document.createElement('h3'); heading.textContent = name; section.append(heading);
      const grid = document.createElement('div'); grid.className = 'track-grid';
      tracks.forEach((track) => grid.append(trackCard(track))); section.append(grid); list.append(section);
    });
    updateSummary();
  }

  function updateSummary() {
    const selectedTracks = state.catalog.tracks.filter((track) => state.selected.has(track.id));
    const extensionIds = new Set(selectedTracks.flatMap((track) => track.extensions.map((item) => item.id.toLowerCase())));
    const skillIds = new Set(selectedTracks.flatMap((track) => [...track.skillIds, ...track.ruleIds]));
    summary.textContent = `${state.selected.size} tracks • ${extensionIds.size} unique extension entries • ${skillIds.size} mapped skills and rules`;
  }

  function syncTrackInputs() {
    list.querySelectorAll('input[data-track-id]').forEach((input) => {
      input.checked = state.selected.has(input.dataset.trackId);
    });
  }

  function trackCard(track) {
    const label = document.createElement('label'); label.className = 'track-card';
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = state.selected.has(track.id); input.disabled = Boolean(track.required); input.dataset.trackId = track.id;
    input.addEventListener('change', () => { input.checked ? state.selected.add(track.id) : state.selected.delete(track.id); updateSummary(); });
    const copy = document.createElement('span'); copy.className = 'track-copy';
    const title = document.createElement('strong'); title.textContent = track.name;
    const description = document.createElement('span'); description.textContent = track.description;
    const counts = document.createElement('small'); counts.textContent = `${track.extensions.length} extensions • ${track.skillIds.length} skills • ${track.ruleIds.length} rule packs${track.required ? ' • required' : ''}`;
    const prerequisites = document.createElement('small'); prerequisites.className = 'prerequisites'; prerequisites.textContent = track.prerequisites.length ? `Requires: ${track.prerequisites.join(' • ')}` : 'No additional runtime prerequisite declared.';
    copy.append(title, description, counts, prerequisites); label.append(input, copy); return label;
  }

  function describeEnvironment(value) {
    const platform = value.platform === 'darwin' ? 'macOS' : value.platform === 'win32' ? 'Windows' : value.platform;
    if (!value.hasWorkspace) return `${platform}: extensions can be installed now. Open a local project to generate .crux skills and PROJECT_RULES.`;
    if (!value.trusted) return `${platform}: trust this project before CRUXIDE writes project-local skills or rules.`;
    return `${platform}: trusted local project detected. Track extensions, skills, adapters, and PROJECT_RULES can be prepared together.`;
  }

  function request() {
    const profileTarget = document.querySelector('input[name="profile"]:checked')?.value;
    const scope = document.getElementById('scope').value;
    const ruleMode = document.getElementById('rule-mode').value;
    if (!state.selected.size) { status.textContent = 'Select at least one track.'; return null; }
    if (!state.agents.size) { status.textContent = 'Select at least one agent.'; return null; }
    return { trackIds: [...state.selected], agents: [...state.agents], scope, ruleMode, profileTarget };
  }

  search.addEventListener('input', render);
  document.getElementById('all').addEventListener('click', () => { state.catalog?.tracks.forEach((track) => state.selected.add(track.id)); syncTrackInputs(); updateSummary(); });
  document.getElementById('core').addEventListener('click', () => { state.selected = new Set(state.catalog?.tracks.filter((track) => track.required).map((track) => track.id) || []); syncTrackInputs(); updateSummary(); });
  document.getElementById('profiles').addEventListener('click', () => vscode.postMessage({ command: 'openProfiles' }));
  document.getElementById('skills').addEventListener('click', () => vscode.postMessage({ command: 'openSkills' }));
  document.getElementById('apply').addEventListener('click', () => { const value = request(); if (value) { status.textContent = 'Waiting for your confirmation…'; vscode.postMessage({ command: 'apply', request: value }); } });
  vscode.postMessage({ command: 'ready' });
})();
