import { registerCommand, SettingsModal } from './components';
import { isOpen, useModalRegistry } from './state';

export function registerGlobalCommands() {
    registerCommand({
        key: 'openSettings',
        name: 'Open Settings',
        handler: () => {
            if (!isOpen(SettingsModal)) {
                useModalRegistry.getState().open(SettingsModal);
            }
        },
    });
}
