import { Settings } from 'common/models/Settings';
import { Command, DEFAULT_KEY_MAP, commands } from '../components';

const isControlKey = (key: string) => [
    'Control',
    'Shift',
    'Alt',
    'Meta',
].includes(key);

const OSSpecificKeys = {
    win: 'meta',
    alt: 'alt',
    ctrl: 'ctrl',
    option: 'alt',
    cmd: 'meta',
};

const SpecialKeys = {
    CTRL: 'ctrl',
    SHIFT: 'shift',
    SPACE: 'space',

    // on mac, CMD key is handled as Meta key, so we swap it, in order to have the same hand shortcuts
    ALT: interop.isMacOS ? 'meta' : 'alt',

    // same here, windows key turns into option key on macos, but those are handled differently
    META: interop.isMacOS  ? 'alt' : 'meta',
};

export function registerKeyboardShortcuts(shortcuts: Settings['shortcuts']) {
    let keys = [] as string[];
    const mappedCommands = new Map<string, Command>();

    commands.forEach(command => {
        const defaultCommandShortcut = interop.isMacOS
            ? DEFAULT_KEY_MAP.macos[command.key]
            : DEFAULT_KEY_MAP.default[command.key];

        const commandShortcut = shortcuts[command.key] || defaultCommandShortcut;

        if (!commandShortcut) return;

        mappedCommands.set(commandShortcut, command);
    });

    function handleKeyboardUp(event: KeyboardEvent) {
        if (keys.length === 0) return;

        const shortcut = keys.join('+');

        if (mappedCommands.has(shortcut)) {
            console.log('[Keyboard Shortcut]', keys.join(' + '));

            mappedCommands.get(shortcut)!.handler();
        }

        keys = [];
    }

    function handleKeyboardDown(event: KeyboardEvent) {
        if (isControlKey(event.key)) return;

        if (event.ctrlKey) keys.push(SpecialKeys.CTRL);
        if (event.altKey) keys.push(SpecialKeys.ALT);
        if (event.metaKey) keys.push(SpecialKeys.META);
        if (event.shiftKey) keys.push(SpecialKeys.SHIFT);

        const key = event.key.toLowerCase()
            .replace(' ', SpecialKeys.SPACE);

        !keys.includes(key) && keys.push(key);
    }

    window.addEventListener('keydown', handleKeyboardDown);
    window.addEventListener('keyup', handleKeyboardUp);

    return function() {
        window.removeEventListener('keydown', handleKeyboardDown);
        window.removeEventListener('keyup', handleKeyboardUp);
    };
}
