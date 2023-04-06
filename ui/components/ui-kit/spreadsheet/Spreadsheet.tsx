import { DragEvent, KeyboardEvent, SyntheticEvent, useState } from 'react';
import classnames from 'classnames';
import { DatabaseColumn, DatabaseRow, QueryField } from 'common/models/Database';
import Row from './Row';
import { arrowNavigationMap, focusCell, getCellRowAndColumnFromEvent, throttleByEventTarget } from './utils';

export interface IRangePoint {
    rowIndex: number;
    colIndex: number;
    column: string;
    row: DatabaseRow;
}

export interface SpreadSheetProps {
    columns: Array<QueryField | DatabaseColumn>;
    rows: DatabaseRow[];
}

export function Spreadsheet({ rows, columns }: SpreadSheetProps) {
    const [rangeStart, setRangeStart] = useState<IRangePoint | null>(null);
    const [rangeEnd, setRangeEnd] = useState<IRangePoint | null>(null);

    const spacingClasses = classnames('py-2 px-3');
    const colorClasses = classnames('bg-scene-300');

    const cellClasses = classnames('truncate', spacingClasses, colorClasses);
    const activeCellClasses = classnames('truncate bg-accent-900', spacingClasses);
    const headerClasses = classnames('text-center font-bold text-sm select-none', cellClasses);

    return (
        <>
            <div
                className="inline-grid text-scene-default bg-scene-400 gap-[1px] border-scene-400 border-[1px]" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, max-content)` }}
                onClick={handleCellClick}
                onKeyDown={handleKeyboardNavigation}
                onDragStart={handleCellClick}
                onDragOver={throttleByEventTarget(handleDragOver)}
            >
                <div className={classnames('min-w-[50px]', headerClasses)} />
                {columns.map(column => (
                    <div key={column.name} className={headerClasses}>
                        {column.name}
                    </div>
                ))}
                {rows.map((row, idx) => (
                    <Row
                        key={idx}
                        index={idx}
                        columns={columns} row={row}
                        headerClasses={headerClasses}
                        activeRangeStart={rangeStart}
                        activeRangeEnd={rangeEnd}
                        cellClasses={cellClasses}
                        activeCellClasses={activeCellClasses}
                    />
                ))}
            </div>
        </>
    );

    function setSelectedCell(rowIndex: number, colIndex: number) {
        const rangePoint: IRangePoint = {
            rowIndex: rowIndex,
            colIndex: colIndex,
            row: rows[rowIndex],
            column: columns[colIndex].name
        };

        setRangeStart(rangePoint);
        setRangeEnd(rangePoint);
    }

    function handleDragOver(e: DragEvent, target: HTMLElement) {
        if (!rangeStart) return;

        const [rowIndex, colName] = getCellRowAndColumnFromEvent(e);

        if (rowIndex === null || colName === null) return;

        const row = Number(rowIndex);
        const colIndex = columns.findIndex(col => col.name === colName);

        setRangeEnd({
            rowIndex: row,
            colIndex: colIndex,
            row: rows[row],
            column: columns[colIndex].name
        });
    }

    function handleKeyboardNavigation(event: KeyboardEvent) {
        if (!rangeStart) return;
        if (!event.key.startsWith('Arrow')) return;

        const [rowIndex, colName] = getCellRowAndColumnFromEvent(event);

        if (rowIndex === null || colName === null) return;

        const colIndex = columns.findIndex(col => col.name === colName);
        const [newCol, newRow] = arrowNavigationMap[event.key as keyof typeof arrowNavigationMap]({
            x: colIndex,
            y: Number(rowIndex),
            maxX: columns.length - 1,
            maxY: rows.length - 1
        });

        setSelectedCell(newRow, newCol);

        focusCell(newRow, columns[newCol].name);
    }

    function handleCellClick(event: SyntheticEvent) {
        const [rowIndex, colName] = getCellRowAndColumnFromEvent(event);

        if (rowIndex === null || colName === null) return;

        const colIndex = columns.findIndex(column => column.name === colName);

        setSelectedCell(Number(rowIndex), colIndex);
    }
}
