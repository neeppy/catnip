import { DndContext, DragOverEvent } from '@dnd-kit/core';
import { PropsWithChildren, useContext } from 'react';
import { isSameCell } from '../utils';
import { TableContext } from '../context';

export function DndWrapper({ children }: PropsWithChildren) {
    const { range } = useContext(TableContext);

    return (
        <DndContext onDragOver={handleDragOver}>
            {children}
        </DndContext>
    );

    function handleDragOver(event: DragOverEvent) {
        if (isSameCell(event.active, event.over)) return;

        const { row, column } = event.over?.data.current ?? { row: 0, column: 0 };

        range.expandCurrentRange(row, column);
    }
}
