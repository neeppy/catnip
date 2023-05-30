import { useDraggable, useDroppable } from '@dnd-kit/core';
import { fnMerge } from 'ui/utils/functions';

export function useCellDrag(rowIndex: number, columnIndex: number, isEditable?: boolean) {
    const dndData = {
        type: 'cell',
        row: rowIndex,
        column: columnIndex,
    };

    const { setNodeRef: createDroppableRef } = useDroppable({
        id: `drop-${rowIndex}-${columnIndex}`,
        data: dndData,
    });

    const { attributes, listeners, setNodeRef: createDraggableRef } = useDraggable({
        id: `cell-${rowIndex}-${columnIndex}`,
        data: dndData,
        disabled: isEditable,
    });

    if (listeners) {
        delete listeners.onKeyDown;
    }

    return [fnMerge(createDraggableRef, createDroppableRef), {
        ...attributes,
        ...listeners,
    }] as const;
}
