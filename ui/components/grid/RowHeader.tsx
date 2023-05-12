import { GridChildComponentProps } from 'react-window';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import classnames from 'classnames';
import { CellProps } from './Cell';
import { fnMerge } from 'ui/utils/functions';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function RowHeader({ rowIndex, data, style }: GridChildComponentProps<CellProps>) {
    const dndData = {
        row: rowIndex,
        type: 'row',
    };

    const { attributes, listeners, setNodeRef: createDragRef } = useDraggable({
        id: `row-${rowIndex}`,
        data: dndData,
    });

    const { setNodeRef: createDropRef } = useDroppable({
        id: `row-drop-${rowIndex}`,
        data: dndData,
    });

    const { allRanges, selectAll } = data;

    const isActive = allRanges.some(range => isBetween(rowIndex, range.start.row, range.end.row));

    const cellClass = classnames('text-sm flex-center font-semibold border-surface-700 border-l border-br cursor-pointer', {
        'border-t': rowIndex === 0,
        'bg-primary-500/50': isActive,
        'bg-surface-500 text-foreground-default': !isActive,
    });

    return (
        <div
            ref={rowIndex > 0 ? fnMerge(createDragRef, createDropRef) : undefined}
            className={cellClass} style={style}
            {...rowIndex > 0 && { ...attributes, ...listeners }}
            {...rowIndex === 0 && { onClick: selectAll }}
        >
            <code>{rowIndex === 0 ? '' : rowIndex}</code>
        </div>
    );
}
