import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(callback: Function) {
    const containerRef = useRef<T>(null);

    useEffect(() => {
        function onClickOutside(event: PointerEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as HTMLElement)) {
                callback();
            }
        }

        window.addEventListener('pointerdown', onClickOutside);

        return () => window.removeEventListener('pointerdown', onClickOutside);
    }, []);

    return containerRef;
}
