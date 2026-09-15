(() => {
  'use strict';
  const vscode = acquireVsCodeApi();
  const agentLabels = { codex: 'Codex', 'claude-code': 'Claude Code', copilot: 'GitHub Copilot', cursor: 'Cursor', gemini: 'Gemini', generic: 'Generic / other' };
  const state = { catalog: null, selected: new Set(), agents: new Set(['codex']) };
  const list = document.getElementById('skill-list');
  const summary = document.getElementById('summary');
  const category = document.getElementById('category');
  const search = document.getElementById('search');
  const status = document.getElementById('status');

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
    if (message.command === 'catalog') {
      state.catalog = message.catalog;
      state.catalog.skills.filter((skill) => skill.required).forEach((skill) => state.selected.add(skill.id));
      state.catalog.categories.forEach((name) => { const option = document.createElement('option'); option.value = name; option.textContent = name; category.append(option); });
      render();
    } else if (message.command === 'installed') {
      status.textContent = `Installed ${message.result.installed} bundled skills and created ${message.result.adapters} agent adapters. ${message.result.note}`;
    } else if (message.command === 'uninstalled') {
      status.textContent = `Removed ${message.result.installed} bundled skills and ${message.result.adapters} agent adapters. ${message.result.note}`;
    } else if (message.command === 'error') status.textContent = message.detail;
  });

  function render() {
    if (!state.catalog) return;
    const term = search.value.trim().toLowerCase();
    const visible = state.catalog.skills.filter((skill) => (!category.value || skill.category === category.value) && (!term || `${skill.name} ${skill.description} ${skill.tags.join(' ')}`.toLowerCase().includes(term)));
    list.replaceChildren();
    const groups = new Map();
    visible.forEach((skill) => { const group = groups.get(skill.category) || []; group.push(skill); groups.set(skill.category, group); });
    groups.forEach((skills, name) => {
      const section = document.createElement('section'); section.className = 'skill-group';
      const heading = document.createElement('h3'); heading.textContent = name; section.append(heading);
      const grid = document.createElement('div'); grid.className = 'skill-grid';
      skills.forEach((skill) => grid.append(skillCard(skill))); section.append(grid); list.append(section);
    });
    summary.textContent = `${state.selected.size} selected • ${state.catalog.skills.length} available • ${visible.length} shown`;
  }

  function skillCard(skill) {
    const label = document.createElement('label'); label.className = `skill-card ${skill.source}`;
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = state.selected.has(skill.id);
    input.disabled = Boolean(skill.required);
    input.addEventListener('change', () => { input.checked ? state.selected.add(skill.id) : state.selected.delete(skill.id); render(); });
    const copy = document.createElement('span'); copy.className = 'skill-copy';
    const title = document.createElement('strong'); title.textContent = skill.name;
    const description = document.createElement('span'); description.textContent = skill.description;
    const badges = document.createElement('span'); badges.className = 'badges';
    [skill.kind, skill.source === 'crux' ? 'Bundled CRUX' : 'Provider review', skill.status, ...(skill.required ? ['Installed by default'] : []), ...(skill.explicitOnly ? ['Explicit only'] : [])].forEach((value) => { const badge = document.createElement('em'); badge.textContent = value; badges.append(badge); });
    const readme = document.createElement('button'); readme.type = 'button'; readme.className = 'link'; readme.textContent = 'README';
    readme.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); vscode.postMessage({ command: 'openReadme', skillId: skill.id }); });
    copy.append(title, description, badges, readme); label.append(input, copy); return label;
  }

  function request() {
    const scope = document.querySelector('input[name="scope"]:checked')?.value;
    const ruleMode = document.getElementById('rule-mode').value;
    if (!state.selected.size) { status.textContent = 'Select at least one skill or rule.'; return null; }
    if (!state.agents.size) { status.textContent = 'Select at least one agent.'; return null; }
    return { skillIds: [...state.selected], agents: [...state.agents], scope, ruleMode };
  }

  search.addEventListener('input', render); category.addEventListener('change', render);
  document.getElementById('recommended').addEventListener('click', () => { state.catalog?.skills.filter((skill) => skill.status === 'recommended').forEach((skill) => state.selected.add(skill.id)); render(); });
  document.getElementById('clear').addEventListener('click', () => { state.selected = new Set(state.catalog?.skills.filter((skill) => skill.required).map((skill) => skill.id) || []); render(); });
  document.getElementById('install').addEventListener('click', () => { const value = request(); if (value) { status.textContent = 'Waiting for confirmation…'; vscode.postMessage({ command: 'install', request: value }); } });
  document.getElementById('copy').addEventListener('click', () => { const value = request(); if (value) vscode.postMessage({ command: 'copyGuide', request: value }); });
  document.getElementById('uninstall').addEventListener('click', () => { const value = request(); if (value) { status.textContent = 'Waiting for confirmation…'; vscode.postMessage({ command: 'uninstall', request: value }); } });
  vscode.postMessage({ command: 'ready' });
})();
