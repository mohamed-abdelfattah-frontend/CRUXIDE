import * as vscode from 'vscode';

interface CruxAction {
  readonly command: string;
  readonly description: string;
  readonly icon: string;
  readonly label: string;
}

const ACTIONS: readonly CruxAction[] = [
  { command: 'cruxide.openHome', description: 'Open the developer launchpad', icon: 'home', label: 'CRUXIDE Home' },
  { command: 'cruxide.openSkills', description: 'Choose portable agent capabilities', icon: 'tools', label: 'CRUX Skills' },
  { command: 'cruxide.openFolder', description: 'Open a workspace folder', icon: 'folder-opened', label: 'Open Project' },
  { command: 'cruxide.newFile', description: 'Start from an empty editor', icon: 'new-file', label: 'New Code File' },
  { command: 'cruxide.applyExperience', description: 'Restore CRUXIDE theme and defaults', icon: 'paintcan', label: 'Apply Experience' },
  { command: 'cruxide.openExtensions', description: 'Manage installed extensions', icon: 'extensions', label: 'Developer Tools' },
];

export class ActionsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    return ACTIONS.map((action) => {
      const item = new vscode.TreeItem(action.label, vscode.TreeItemCollapsibleState.None);
      item.description = action.description;
      item.iconPath = new vscode.ThemeIcon(action.icon);
      item.command = { command: action.command, title: action.label };
      return item;
    });
  }
}
