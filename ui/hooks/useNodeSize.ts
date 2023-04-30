import { useEffect, useState } from 'react';
import { useResizeObserver } from 'ui/hooks/useResizeObserver';
import { debounce } from 'ui/utils/debounce';

interface Size {
    width: number;
    height: number;
}

export function useNodeSize() {
    const nodeRef = useResizeObserver(debounce(200, (entries => {
        const { width, height } = entries[0].contentRect;

        setSize({ width, height });
    }) as ResizeObserverCallback));

    const [size, setSize] = useState<Size | null>(null);

    useEffect(() => {
        if (nodeRef.current) {
            const { width, height } = nodeRef.current.getBoundingClientRect();

            setSize({ width, height });
        }
    }, []);

    return [nodeRef, size] as const;
}
