/**
 * A minimal DOM good enough to execute media/setup.js.
 *
 * CRUXIDE's rules discourage adding a dependency solely for a check, and the
 * webview script touches only a small, well-defined slice of the DOM API, so
 * that slice is modelled here instead of pulling in a full DOM implementation.
 *
 * Node identity is the point: the scroll-preservation contract is that toggling
 * a track mutates the existing input elements rather than recreating them, so
 * the harness must let a test hold a reference to a node and see whether it is
 * still attached afterwards.
 */

import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

class ClassList {
  #node;
  constructor(node) { this.#node = node; }
  add(...names) {
    const current = new Set((this.#node.className || '').split(' ').filter(Boolean));
    for (const n of names) current.add(n);
    this.#node.className = [...current].join(' ');
  }
  contains(name) { return (this.#node.className || '').split(' ').includes(name); }
}

class Element {
  constructor(tagName) {
    this.tagName = String(tagName).toLowerCase();
    this.children = [];
    this.parentNode = null;
    this.listeners = new Map();
    this.dataset = {};
    this.attributes = {};
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.type = '';
    this.name = '';
    this.classList = new ClassList(this);
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node == null) continue;
      node.parentNode = this;
      this.children.push(node);
    }
  }

  appendChild(node) { this.append(node); return node; }

  /** Detaches every current child. This is what destroys scroll and focus. */
  replaceChildren(...nodes) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    this.append(...nodes);
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(type, event = {}) {
    for (const handler of this.listeners.get(type) ?? []) handler({ type, target: this, ...event });
  }

  /** Every descendant, depth first. */
  descendants() {
    const out = [];
    for (const child of this.children) {
      out.push(child, ...child.descendants());
    }
    return out;
  }

  /** Supports only the selectors media/setup.js actually uses. */
  querySelectorAll(selector) {
    const all = this.descendants();
    if (selector === 'input[data-track-id]') {
      return all.filter((n) => n.tagName === 'input' && n.dataset.trackId !== undefined);
    }
    if (selector === 'input[name="profile"]:checked') {
      return all.filter((n) => n.tagName === 'input' && n.name === 'profile' && n.checked);
    }
    throw new Error(`unsupported selector in harness: ${selector}`);
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0]; }

  /** True while this node is still attached to the tree it was created in. */
  get isConnected() {
    let node = this;
    while (node.parentNode) node = node.parentNode;
    return node.isRoot === true;
  }
}

/**
 * Build a document containing the elements setup.js looks up by id, run the
 * script, and return handles for driving it.
 *
 * @param {string} scriptPath Absolute path to media/setup.js.
 */
export async function loadSetupWebview(scriptPath) {
  const root = new Element('body');
  root.isRoot = true;

  const byId = new Map();
  const make = (id, tagName = 'div') => {
    const el = new Element(tagName);
    el.id = id;
    byId.set(id, el);
    root.append(el);
    return el;
  };

  for (const id of ['track-list', 'summary', 'search', 'status', 'environment', 'agents']) make(id);
  for (const id of ['all', 'core', 'profiles', 'skills', 'apply']) make(id, 'button');
  for (const id of ['scope', 'rule-mode']) {
    const el = make(id, 'select');
    el.value = id === 'scope' ? 'project-local' : 'guidance';
  }

  const profileInput = new Element('input');
  profileInput.name = 'profile';
  profileInput.type = 'radio';
  profileInput.checked = true;
  profileInput.value = 'current';
  root.append(profileInput);

  const posted = [];
  const windowListeners = new Map();

  const document = {
    getElementById: (id) => byId.get(id) ?? null,
    createElement: (tagName) => new Element(tagName),
    createTextNode: (text) => {
      const node = new Element('#text');
      node.textContent = String(text);
      return node;
    },
    querySelector: (selector) => root.querySelector(selector),
    querySelectorAll: (selector) => root.querySelectorAll(selector),
  };

  const sandbox = {
    document,
    acquireVsCodeApi: () => ({
      // The real postMessage structured-clones across the webview boundary, so
      // serialise here too. It also detaches the value from the vm realm, whose
      // Object.prototype would otherwise defeat deepStrictEqual in tests.
      postMessage: (message) => posted.push(JSON.parse(JSON.stringify(message))),
    }),
    window: {
      addEventListener: (type, handler) => {
        if (!windowListeners.has(type)) windowListeners.set(type, []);
        windowListeners.get(type).push(handler);
      },
    },
    console,
  };
  sandbox.globalThis = sandbox;

  runInNewContext(await readFile(scriptPath, 'utf8'), sandbox, { filename: scriptPath });

  return {
    root,
    posted,
    element: (id) => byId.get(id),
    /** Deliver a message from the extension host to the webview. */
    postToWebview: (message) => {
      for (const handler of windowListeners.get('message') ?? []) handler({ data: message });
    },
    /** Every track checkbox currently in the list, in document order. */
    trackInputs: () => byId.get('track-list').querySelectorAll('input[data-track-id]'),
    click: (id) => byId.get(id).dispatchEvent('click'),
  };
}

/** A catalog shaped like the one SetupPanel posts, with `count` tracks. */
export function fakeCatalog(count = 6) {
  return {
    tracks: Array.from({ length: count }, (_, i) => ({
      id: `track-${i}`,
      name: `Track ${i}`,
      description: `Description ${i}`,
      category: i < count / 2 ? 'Core' : 'Frontend',
      extensions: [{ id: `pub.ext-${i}`, name: `Ext ${i}` }],
      skillIds: [`skill-${i}`],
      ruleIds: [`rule-${i}`],
      prerequisites: [],
      required: i === 0,
      tags: [`tag-${i}`],
    })),
  };
}
