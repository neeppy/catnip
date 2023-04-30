import { KeyboardEvent, MouseEvent } from 'react';
import { GridChildComponentProps } from 'react-window';
import classnames from 'classnames';
import type { CellProps } from './Cell';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function DataCell({ rowIndex, columnIndex, data, style }: GridChildComponentProps<CellProps>) {
    const { rows, columns, onCellClick, onKeyboardNavigation, rangeStart, rangeEnd } = data;
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

    return (
        <div
            className={cellClass} style={style} tabIndex={0}
            data-row={rowIndex}
            data-col={columnIndex}
            onKeyDown={handleKeyDown} onClick={onClick}
        >
            {String(rows[rowIndex - 1][column])}
        </div>
    );

    function onClick(e: MouseEvent) {
        onCellClick(e, rowIndex, columnIndex);
    }

    function handleKeyDown(e: KeyboardEvent) {
        e.preventDefault();

        if (e.key.startsWith('Arrow')) {
            onKeyboardNavigation(e);
        }
    }
}
