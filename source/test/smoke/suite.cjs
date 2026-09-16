const assert = require('node:assert/strict');
const vscode = require('vscode');

async function run() {
  const extension = vscode.extensions.getExtension('cruxcode.cruxide');
  assert.ok(extension, 'CRUXIDE must be discoverable by the Extension Host');

  await extension.activate();
  assert.equal(extension.isActive, true, 'CRUXIDE must activate successfully');

  const commands = new Set(await vscode.commands.getCommands(true));
  for (const command of [
    'cruxide.openHome',
    'cruxide.openSetup',
    'cruxide.openSkills',
    'cruxide.applyExperience',
    'cruxide.newFile',
    'cruxide.openFolder',
    'cruxide.openExtensions',
  ]) {
    assert.ok(commands.has(command), `${command} must be registered`);
  }

  const configuration = vscode.workspace.getConfiguration('cruxide');
  assert.equal(configuration.get('openHomeOnEmpty'), true);
  assert.equal(configuration.get('promptToOpenSetupOnFirstRun'), true);
}

module.exports = { run };
