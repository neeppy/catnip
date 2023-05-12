import { useEffect, useRef } from 'react';

export function useAutoFocus() {
    const nodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (nodeRef.current) {
            nodeRef.current.focus();
        }
    }, []);

    return nodeRef;
}
