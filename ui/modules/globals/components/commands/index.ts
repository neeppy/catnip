export type Command = {
    key: string;
    name: string;
    handler: VoidFn;
}

export * from './defaults';
export const commands = new Map<string, Command>();

export function registerCommand(command: Command) {
    commands.set(command.key, command);
}
