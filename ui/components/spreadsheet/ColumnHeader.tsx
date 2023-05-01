import classnames from 'classnames';
import { GridChildComponentProps } from 'react-window';
import { CellProps } from './Cell';

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function ColumnHeader({ columnIndex, data, style }: GridChildComponentProps<CellProps>) {
    const { columns, rangeStart, rangeEnd } = data;
    const column = columns[columnIndex - 1].name;
    const isActive = rangeStart && rangeEnd && isBetween(columnIndex, rangeStart.column, rangeEnd.column);

    const cellClass = classnames('text-sm flex-center font-semibold border-surface-700 border-t border-br', {
        'bg-primary-transparent': isActive,
        'bg-surface-500 text-foreground-default': !isActive,
    });

    return (
        <div className={cellClass} style={style}>
            {column}
        </div>
    );
}
