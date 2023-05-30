import { KeyboardEvent } from 'react';
import type { GridChildComponentProps } from 'react-window';
import type { Collection } from 'ui/hooks';
import type { GridProps } from './DynamicGrid';
import type { Range } from './useRangeCollection';
import { RowHeader } from './RowHeader';
import { ColumnHeader } from './ColumnHeader';
import { CellChange, DataCell } from './DataCell';

export interface CellProps extends GridProps {
    allRanges: Range[];
    selectAll: () => void;
    onKeyboardNavigation: (event: KeyboardEvent) => void;
    changes: CellChange[];
    collection: Collection<CellChange>;
    select: (type: SelectionType, row: number, column: number, ctrlKey?: boolean, shiftKey?: boolean) => void;
}

export type SelectionType = 'row' | 'column' | 'cell';

export interface SelectionData {
    row: number;
    column: number;
    type: SelectionType;
}

const CELL_TYPES = [
    {
        when: (row: number, col: number) => col === 0,
        component: RowHeader,
    },
    {
        when: (row: number, col: number) => row === 0 && col > 0,
        component: ColumnHeader,
    },
    {
        when: (row: number, col: number) => row > 0 && col > 0,
        component: DataCell,
    }
];

export function Cell(props: GridChildComponentProps<CellProps>) {
    const { component: Component } = CELL_TYPES.find(cellType => cellType.when(props.rowIndex, props.columnIndex))!;

    return (
        <Component {...props} />
    );
}
