import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import { IRangePoint } from 'ui-kit/spreadsheet/Spreadsheet';

type Direction = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

interface OwnProps {
    index: number;
    columns: DatabaseColumn[];
    row: DatabaseRow;
    activeRangeStart: IRangePoint | null;
    activeRangeEnd: IRangePoint | null;
    headerClasses?: string;
    cellClasses?: string;
    activeCellClasses?: string;
    onCellClick: (t: IRangePoint) => void;
    onRangeCaptureStart: (t: IRangePoint) => void;
    onRangeCapture: (t: IRangePoint) => void;
    onKeyboardNavigate: (direction: Direction) => void;
}

const isBetween = (num: number, bounds: [number, number]) => num >= Math.min(...bounds) && num <= Math.max(...bounds);

export default function Row({
    index,
    columns,
    row,
    activeRangeStart,
    activeRangeEnd,
    headerClasses,
    activeCellClasses,
    cellClasses,
    onCellClick,
    onRangeCapture,
    onRangeCaptureStart,
    onKeyboardNavigate
}: OwnProps) {
    const isActiveRow = activeRangeStart && activeRangeEnd &&
        isBetween(index, [activeRangeStart.rowIndex, activeRangeEnd.rowIndex]);

    return (
        <>
            <div className={headerClasses}>{index + 1}</div>
            {columns.map(column => {
                const columnIndex = columns.indexOf(column);

                const isActiveColumn = activeRangeStart && activeRangeEnd &&
                    isBetween(columnIndex, [activeRangeStart.colIndex, activeRangeEnd.colIndex]);

                const isActive = isActiveRow && isActiveColumn;

                const rangePoint = {
                    rowIndex: index,
                    colIndex: columnIndex,
                    column: column.name,
                    row: row
                };

                return (
                    <div
                        key={`${index + 1}-${column.name}`}
                        tabIndex={0}
                        className={isActive ? activeCellClasses : cellClasses}
                        draggable
                        onClick={e => {
                            onCellClick(rangePoint);
                        }}
                        onKeyDown={e => {
                            if (e.key.startsWith('Arrow')) {
                                onKeyboardNavigate(e.key as Direction);
                            }
                        }}
                        onDragStart={e => {
                            e.dataTransfer.setDragImage(new Image(), 0, 0);

                            onRangeCaptureStart(rangePoint);
                        }}
                        onDragOver={() => onRangeCapture(rangePoint)}
                    >
                        {String(row[column.name])}
                    </div>
                );
            })}
        </>
    );
}
