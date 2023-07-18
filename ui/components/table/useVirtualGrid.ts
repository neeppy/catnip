import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface GridOptions {
    rows: number;
    columns: number;
    horizontalPaddingStart?: number;
    verticalPaddingStart?: number;
    getRowSize: (index: number) => number;
    getColumnSize: (index: number) => number;
}

export function useVirtualGrid(options: GridOptions) {
    const parentRef = useRef<any>(null);
    const rowVirtualizer = useVirtualizer({
        count: options.rows,
        getScrollElement: () => parentRef.current,
        paddingStart: options.verticalPaddingStart,
        estimateSize: options.getRowSize,
    });

    const colVirtualizer = useVirtualizer({
        count: options.columns,
        horizontal: true,
        getScrollElement: () => parentRef.current,
        paddingStart: options.horizontalPaddingStart,
        estimateSize: options.getColumnSize,
    });

    const columnItems = colVirtualizer.getVirtualItems();
    const [before, after] = columnItems.length > 0 ? [
        columnItems[0].start,
        colVirtualizer.getTotalSize() - columnItems.at(-1)!.end,
    ] : [0, 0];

    return {
        containerRef: parentRef,
        virtual: {
            rows: rowVirtualizer,
            columns: colVirtualizer,
        },
        spacing: { before, after },
    } as const;
}
