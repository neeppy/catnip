import { useLayoutEffect, useRef, useState } from 'react';
import { useModalRegistry } from '$module:globals';

type State = 'opening' | 'open' | 'closing';

export function useModalAnimationState(key: string, duration: number = 200) {
    const [state, setState] = useState<State>('opening');
    const close = useModalRegistry(state => state.close);
    const timeoutRef = useRef<any>(null);

    useLayoutEffect(() => {
        timeoutRef.current = setTimeout(() => setState('open'), duration);

        return () => clearTimeout(timeoutRef.current);
    }, []);

    function handleAnimatedModalClose() {
        clearTimeout(timeoutRef.current);
        setState('closing');

        setTimeout(() => close(key), duration);
    }

    return [state, handleAnimatedModalClose] as const;
}
