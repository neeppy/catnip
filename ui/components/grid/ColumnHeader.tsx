import { MouseEvent } from 'react';
import classnames from 'classnames';
import { GridChildComponentProps } from 'react-window';
import { CellProps } from './Cell';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { fnMerge } from 'ui/utils/functions';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function ColumnHeader({ columnIndex, data, style }: GridChildComponentProps<CellProps>) {
    const dndData = {
        column: columnIndex,
        type: 'column',
    };

    const { attributes, listeners, setNodeRef: createDragRef } = useDraggable({
        id: `column-${columnIndex}`,
        data: dndData,
    });

    const { setNodeRef: createDropRef } = useDroppable({
        id: `col-drop-${columnIndex}`,
        data: dndData,
    });

    const { allRanges, rows, select, columns } = data;
    const column = columns[columnIndex - 1];

    const isActive = allRanges.some(range => isBetween(columnIndex, range.start.column, range.end.column));

    const cellClass = classnames('text-foreground-default text-sm flex-center font-semibold border-surface-700 border-t border-br px-3', {
        'bg-primary-500/50': isActive,
        'bg-surface-500 text-foreground-default': !isActive,
    });

    return (
        <div
            ref={fnMerge(createDragRef, createDropRef)}
            className={cellClass} style={style}
            onMouseDown={onColumnSelection}
            {...attributes}
            {...listeners}
        >
            <code className="truncate">{column.name}</code>
        </div>
    );

    function onColumnSelection(event: MouseEvent) {
        select('column', rows.length, columnIndex, event.ctrlKey || event.metaKey, event.shiftKey);
    }
}
