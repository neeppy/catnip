import { IRangePoint, SpreadSheetProps } from 'ui-kit/spreadsheet/Spreadsheet';
import { DatabaseRow } from 'common/models/Database';

interface OwnProps {
    index: number;
    columns: SpreadSheetProps['columns'];
    row: DatabaseRow;
    activeRangeStart: IRangePoint | null;
    activeRangeEnd: IRangePoint | null;
    headerClasses?: string;
    cellClasses?: string;
    activeCellClasses?: string;
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
    cellClasses
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

                return (
                    <div
                        key={`${index + 1}-${column.name}`}
                        tabIndex={0}
                        className={isActive ? activeCellClasses : cellClasses}
                        draggable
                        data-row-index={index}
                        data-col-name={column.name}
                    >
                        {String(row[column.name])}
                    </div>
                );
            })}
        </>
    );
}
