import { useEffect, useRef } from 'react';

export function useResizeObserver(handler: ResizeObserverCallback) {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new ResizeObserver(handler);

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    });

    return elementRef;
}
