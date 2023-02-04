import { CellChange, DateCell, DefaultCellTypes, NumberCell, ReactGrid, Row, TextCell } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import 'ui/assets/grid.css';
import { useState } from 'react';

interface OwnProps {
    rows: Array<Record<string, unknown>>;
}

const ColumnTypeConstructors = {
    number: (value: number): NumberCell => ({
        type: 'number',
        value,
    }),
    text: (value: string): TextCell => ({
        type: 'text',
        text: value,
    }),
    date: (value: Date): DateCell => ({
        type: 'date',
        date: value,
    }),
};

function getColumnType(value: unknown): keyof typeof ColumnTypeConstructors {
    if (typeof value === 'number') return 'number';
    else if (value instanceof Date) return 'date';
    else return 'text';
}

function getColumn(value: any): DefaultCellTypes {
    const type = getColumnType(value);

    const columnConstructor = ColumnTypeConstructors[type] as (value: any) => DefaultCellTypes;

    return columnConstructor(value);
}

export const DataTable = ({ rows }: OwnProps) => {
    const [data, setData] = useState(rows || []);

    const columns = Object.keys(data[0]).map(key => ({ columnId: key }));
    const gridRows: Row[] = [
        {
            rowId: 'header',
            cells: columns.map(col => ({
                type: 'header',
                text: col.columnId
            })),
        },
        ...rows.map((dataRow, idx) => ({
            rowId: idx,
            cells: columns.map(col => getColumn(dataRow[col.columnId])),
        })),
    ];

    function onCellChange(cellChanges: CellChange[]) {
        console.log(cellChanges);

        setData(prevData => {
            cellChanges.forEach(change => {
                const idx = change.rowId as number;
                const field = change.columnId;

                // this is according to the grid docs - reassigning is not ideal, but beats the alternatives
                switch (change.newCell.type) {
                    case 'text':
                        return prevData[idx][field] = change.newCell.text;
                    case 'number':
                        return prevData[idx][field] = change.newCell.value;
                    case 'date':
                        return prevData[idx][field] = change.newCell.date;
                }
            });

            return [...prevData];
        });
    }

    return (
        <ReactGrid
            columns={columns}
            rows={gridRows}
            enableRangeSelection
            onCellsChanged={onCellChange}
        />
    );
};
