import { KeyboardEvent, MouseEvent } from 'react';
import { GridChildComponentProps } from 'react-window';
import classnames from 'classnames';
import type { CellProps } from './Cell';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function DataCell({ rowIndex, columnIndex, data, style }: GridChildComponentProps<CellProps>) {
    const dndData = {
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
    });

    const { rows, columns, onKeyboardNavigation, rangeStart, rangeEnd } = data;
    const column = columns[columnIndex - 1].name;

    const isRowActive = rangeStart && rangeEnd && isBetween(rowIndex, rangeStart.row, rangeEnd.row);
    const isColActive = rangeStart && rangeEnd && isBetween(columnIndex, rangeStart.column, rangeEnd.column);
    const isActive = isRowActive && isColActive;

    const isOnlyActive = isActive && rangeStart?.row === rangeEnd?.row && rangeStart?.column === rangeEnd?.column;

    const cellClass = classnames('text-sm flex items-center text-foreground-default border-surface-700 px-3 truncate border-br duration-200 ease-out', {
        'bg-primary-600': isActive,
        'scale-105 shadow-lg z-10 border-none': isOnlyActive,
        'bg-surface-500 border-br': !isActive,
    });

    if (listeners) {
        delete listeners.onKeyDown;
    }

    return (
        <div
            ref={ref => {
                createDraggableRef(ref);
                createDroppableRef(ref);
            }}
            className={cellClass} style={style}
            data-row={rowIndex}
            data-col={columnIndex}
            onKeyDown={handleKeyDown}
            {...attributes}
            {...listeners}
        >
            {String(rows[rowIndex - 1][column])}
        </div>
    );

    function handleKeyDown(e: KeyboardEvent) {
        e.preventDefault();

        if (e.key.startsWith('Arrow')) {
            onKeyboardNavigation(e);
        }
    }
}
