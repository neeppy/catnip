import { KeyboardEvent, MouseEvent } from 'react';
import { GridChildComponentProps } from 'react-window';
import classnames from 'classnames';
import type { CellProps } from './Cell';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { fnMerge } from 'ui/utils/functions';
import { isInRange } from '$components/grid/utils';

export function DataCell({ rowIndex, columnIndex, data, style }: GridChildComponentProps<CellProps>) {
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
    });

    const { allRanges, rows, columns, onKeyboardNavigation } = data;
    const column = columns[columnIndex - 1].name;

    const isActive = allRanges.some(range => isInRange(rowIndex, columnIndex, range));

    const firstRange = allRanges[0];
    const isOnlyActive = isActive && allRanges.length === 1 &&
        firstRange.start.row === firstRange.end.row &&
        firstRange.start.column === firstRange.end.column;

    const cellClass = classnames('text-sm flex items-center text-foreground-default border-surface-700 px-3 border-br duration-200 ease-out', {
        'bg-primary-600': isActive,
        'scale-105 shadow-lg z-10 border-none': isOnlyActive,
        'bg-surface-500 border-br': !isActive,
    });

    if (listeners) {
        delete listeners.onKeyDown;
    }

    return (
        <div
            ref={fnMerge(createDraggableRef, createDroppableRef)}
            className={cellClass} style={style}
            data-row={rowIndex}
            data-col={columnIndex}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}
            {...attributes}
            {...listeners}
        >
            <span className="truncate">{String(rows[rowIndex - 1][column])}</span>
        </div>
    );

    function handleDoubleClick(e: MouseEvent) {
        console.log('Double clicked', { rowIndex, columnIndex });
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            onKeyboardNavigation(e);
        }
    }
}
