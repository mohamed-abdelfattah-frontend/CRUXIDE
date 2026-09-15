(() => {
  'use strict';

  const vscode = acquireVsCodeApi();
  const allowedCommands = new Set([
    'commands',
    'extensions',
    'linkedin',
    'newFile',
    'openFolder',
    'skills',
    'website',
  ]);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('button[data-command]');
    const command = button?.getAttribute('data-command');
    if (command && allowedCommands.has(command)) {
      vscode.postMessage({ command });
    }
  });
})();
