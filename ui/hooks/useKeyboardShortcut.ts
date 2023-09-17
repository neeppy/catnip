import { useEffect } from 'react';

export enum Keys {
    Escape = 'Escape',
}

export function useKeyboardShortcut(keys: Keys[], exe: VoidFn) {
    useEffect(() => {
        function callback() {

        }

        document.addEventListener('keydown', callback);

        return () => document.removeEventListener('keydown', callback);
    }, []);
}
