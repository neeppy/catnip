import classnames from 'classnames';
import { GridChildComponentProps } from 'react-window';
import { GridProps } from './DynamicGrid';

export function ColumnHeader({ columnIndex, data, style }: GridChildComponentProps<GridProps>) {
    const { columns } = data;
    const column = columns[columnIndex - 1].name;

    const cellClass = classnames('text-sm flex-center bg-surface-500 text-foreground-default font-semibold border-surface-700 border-t border-br');

    return (
        <div className={cellClass} style={style}>
            {column}
        </div>
    );
}
