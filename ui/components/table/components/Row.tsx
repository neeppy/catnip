import { PropsWithChildren } from 'react';
import { VirtualItem } from '@tanstack/react-virtual';

interface RowProps {
    metadata: VirtualItem;
    containerRef: (node: Element | null) => void;
    spaceBefore: number;
    spaceAfter: number;
}

export function Row({ metadata, containerRef, spaceBefore, spaceAfter, children }: PropsWithChildren<RowProps>) {
    return (
        <div
            key={metadata.key} ref={containerRef}
            data-index={metadata.index}
            className="flex w-full"
        >
            <div style={{ width: `${spaceBefore}px` }} />
            {children}
            <div style={{ width: `${spaceAfter}px` }} />
        </div>
    );
}
