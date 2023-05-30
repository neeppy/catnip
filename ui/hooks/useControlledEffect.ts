import { useEffect } from 'react';

export function useControlledEffect(effect: Function, ...controls: boolean[]) {
    useEffect(() => {
        const allTrue = controls.every(control => control);

        if (allTrue) {
            return effect();
        }
    }, [...controls]);
}
