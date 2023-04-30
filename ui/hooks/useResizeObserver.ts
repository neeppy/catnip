import { useEffect, useRef } from 'react';

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(handler: ResizeObserverCallback) {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        const observer = new ResizeObserver(handler);

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return elementRef;
}
