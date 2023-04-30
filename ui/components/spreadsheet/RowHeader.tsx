import classnames from 'classnames';
import { GridChildComponentProps } from 'react-window';
import { GridProps } from './DynamicGrid';

export function RowHeader({ rowIndex, style }: GridChildComponentProps<GridProps>) {
    const cellClass = classnames('text-sm flex-center bg-surface-500 text-foreground-default font-semibold border-surface-700 border-l border-br', {
        'border-t': rowIndex === 0
    });

    return (
        <div className={cellClass} style={style}>
            {rowIndex === 0 ? '' : rowIndex}
        </div>
    );
}
