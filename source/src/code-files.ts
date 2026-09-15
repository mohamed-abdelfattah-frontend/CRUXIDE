import * as vscode from 'vscode';

const EXCLUDE_GLOB =
  '**/{node_modules,.git,.next,.nuxt,.svelte-kit,.turbo,.angular,.cache,.venv,dist,build,coverage,out,target,vendor}/**';
const MAX_EXTENSIONS = 128;

const CODE_LANGUAGE_IDS = new Set([
  'csharp', 'css', 'go', 'html', 'java', 'javascript', 'javascriptreact', 'json',
  'kotlin', 'python', 'rust', 'scss', 'svelte', 'swift', 'typescript',
  'typescriptreact', 'vue',
]);

export async function hasCodeFiles(): Promise<boolean> {
  if (
    vscode.workspace.textDocuments.some(
      (document) => !document.isClosed && CODE_LANGUAGE_IDS.has(document.languageId),
    )
  ) {
    return true;
  }

  if (!vscode.workspace.workspaceFolders?.length) {
    return false;
  }

  const configuredExtensions = vscode.workspace
    .getConfiguration('cruxide')
    .get<readonly string[]>('codeFileExtensions', []);
  const safeExtensions = [
    ...new Set(
      configuredExtensions
        .slice(0, MAX_EXTENSIONS)
        .map((extension) => extension.replace(/^\./, '').trim().toLowerCase())
        .filter((extension) => /^[a-z0-9]+$/.test(extension)),
    ),
  ].sort();

  if (safeExtensions.length === 0) {
    return false;
  }

  const files = await vscode.workspace.findFiles(
    `**/*.{${safeExtensions.join(',')}}`,
    EXCLUDE_GLOB,
    1,
  );
  return files.length > 0;
}
