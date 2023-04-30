import { KeyboardEvent, MouseEvent } from 'react';
import type { GridChildComponentProps } from 'react-window';
import type { GridProps, RangePoint } from './DynamicGrid';
import { RowHeader } from './RowHeader';
import { ColumnHeader } from './ColumnHeader';
import { DataCell } from './DataCell';

export interface CellProps extends GridProps {
    rangeStart: RangePoint | null;
    rangeEnd: RangePoint | null;
    onCellClick: (event: MouseEvent, row: number, col: number) => void;
    onKeyboardNavigation: (event: KeyboardEvent) => void;
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
