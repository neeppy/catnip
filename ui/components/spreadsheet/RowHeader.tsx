import classnames from 'classnames';
import { GridChildComponentProps } from 'react-window';
import { CellProps } from './Cell';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function RowHeader({ rowIndex, data, style }: GridChildComponentProps<CellProps>) {
    const { rangeStart, rangeEnd } = data;
    const isActive = rangeStart && rangeEnd && isBetween(rowIndex, rangeStart.row, rangeEnd.row);

    const cellClass = classnames('text-sm flex-center font-semibold border-surface-700 border-l border-br', {
        'border-t': rowIndex === 0,
        'bg-primary-transparent': isActive,
        'bg-surface-500 text-foreground-default': !isActive,
    });

    return (
        <div className={cellClass} style={style}>
            {rowIndex === 0 ? '' : rowIndex}
        </div>
    );
}
