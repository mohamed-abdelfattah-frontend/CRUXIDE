export const HOME_COMMANDS = [
  'commands',
  'extensions',
  'linkedin',
  'newFile',
  'openFolder',
  'setup',
  'skills',
  'website',
] as const;

export type HomeCommand = (typeof HOME_COMMANDS)[number];

const ALLOWED_COMMANDS = new Set<string>(HOME_COMMANDS);

export interface HomeMessage {
  readonly command: HomeCommand;
}

export function isHomeMessage(value: unknown): value is HomeMessage {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    !Object.prototype.hasOwnProperty.call(value, 'command')
  ) {
    return false;
  }

  const command = (value as { readonly command?: unknown }).command;
  return typeof command === 'string' && ALLOWED_COMMANDS.has(command);
}
