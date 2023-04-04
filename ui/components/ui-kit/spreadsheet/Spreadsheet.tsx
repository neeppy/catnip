import { useState } from 'react';
import classnames from 'classnames';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import Row from './Row';

type Direction = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

export interface IRangePoint {
    rowIndex: number;
    colIndex: number;
    column: string;
    row: DatabaseRow;
}

interface OwnProps {
    columns: DatabaseColumn[];
    rows: DatabaseRow[];
}

export function Spreadsheet({ rows, columns }: OwnProps) {
    const [rangeStart, setRangeStart] = useState<IRangePoint | null>(null);
    const [rangeEnd, setRangeEnd] = useState<IRangePoint | null>(null);

    const spacingClasses = classnames('py-2 px-3');
    const colorClasses = classnames('bg-scene-300');

    const cellClasses = classnames('truncate', spacingClasses, colorClasses);
    const activeCellClasses = classnames('truncate bg-accent-900', spacingClasses);
    const headerClasses = classnames('text-center font-bold text-sm', cellClasses);

    function onCellClick(t: IRangePoint) {
        console.log(t);

        setRangeStart(t);
        setRangeEnd(t);
    }

    function onMouseDragOver(t: IRangePoint) {
        setRangeEnd(t);
    }

    function handleKeyboardNavigation(direction: Direction) {
        if (!rangeStart) return;

        const { rowIndex, colIndex } = rangeStart;

        switch (direction) {
            case 'ArrowDown':
                if (rowIndex === rows.length - 1) return;
                return onCellClick({
                    ...rangeStart,
                    rowIndex: rowIndex + 1,
                    row: rows[rowIndex + 1]
                });
            case 'ArrowUp':
                if (rowIndex === 0) return;
                return onCellClick({
                    ...rangeStart,
                    rowIndex: rowIndex - 1,
                    row: rows[rowIndex - 1]
                });
            case 'ArrowLeft':
                if (colIndex === 0) return;
                return onCellClick({
                    ...rangeStart,
                    colIndex: colIndex - 1,
                    column: columns[colIndex - 1].name
                });
            case 'ArrowRight':
                if (colIndex === columns.length - 1) return;
                return onCellClick({
                    ...rangeStart,
                    colIndex: colIndex + 1,
                    column: columns[colIndex + 1].name
                });
        }
    }

    return (
        <>
            <div className="inline-grid bg-scene-400 gap-[1px] border-scene-400 border-[1px]" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, max-content)` }}>
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
                        onCellClick={onCellClick}
                        onRangeCaptureStart={onCellClick}
                        onRangeCapture={onMouseDragOver}
                        onKeyboardNavigate={handleKeyboardNavigation}
                    />
                ))}
            </div>
        </>
    );
}
