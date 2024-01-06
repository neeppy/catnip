import { useEffect } from 'react';

export enum Keys {
    Escape = 'Escape',
    Ctrl = 'Control',
    Shift = 'Shift',
    Alt = 'Alt',
}

const registeredShortcuts = {};

export function useKeyboardShortcut(keys: Keys[], exe: VoidFn) {
    useEffect(() => {
        function callback(event: KeyboardEvent) {
            console.log(event.key);
        }

        document.addEventListener('keydown', callback);

        return () => document.removeEventListener('keydown', callback);
    }, []);
}
