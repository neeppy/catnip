import { KeyboardEvent, MouseEvent, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DatabaseColumn, DatabaseRow, QueryField } from 'common/models/Database';
import { useNodeSize } from 'ui/hooks';
import { Cell } from './Cell';
import { arrowNavigationMap, Direction, focusCell } from './utils';

export interface GridProps {
    columns: Array<QueryField | DatabaseColumn>;
    rows: DatabaseRow[];
}

export interface RangePoint {
    row: number;
    column: number;
}

interface WithShiftKey {
    shiftKey: boolean;
}

export function DynamicGrid({ rows, columns }: GridProps) {
    const [parentRef, size] = useNodeSize();
    const gridRef = useRef<VariableSizeGrid>(null);
    const [rangeStart, setRangeStart] = useState<RangePoint | null>(null);
    const [rangeEnd, setRangeEnd] = useState<RangePoint | null>(null);

    return (
        <div className="w-full h-full" ref={parentRef}>
            {size && (
                <VariableSizeGrid
                    className="select-none"
                    ref={gridRef}
                    width={size.width}
                    height={size.height}
                    columnWidth={index => index === 0 ? 40 : 300}
                    rowHeight={() => 40}
                    columnCount={columns.length + 1}
                    rowCount={rows.length + 1}
                    itemData={{ rows, columns, onCellClick, onKeyboardNavigation, rangeStart, rangeEnd }}
                >
                    {Cell}
                </VariableSizeGrid>
            )}
        </div>
    );

    function onCellClick(event: WithShiftKey, row: number, column: number) {
        if (!event.shiftKey || (event.shiftKey && !rangeStart)) {
            setRangeStart({ row, column });
            setRangeEnd({ row, column });
        } else {
            setRangeEnd({ row, column });
        }

        gridRef.current?.scrollToItem({
            columnIndex: column === 1 ? 0 : column,
            rowIndex: row === 1 ? 0 : row,
            align: 'smart',
        });
    }

    function onKeyboardNavigation(event: KeyboardEvent) {
        const refRange = event.shiftKey ? rangeEnd : rangeStart;

        if (!refRange) {
            setRangeStart({ row: 1, column: 1 });
            setRangeEnd({ row: 1, column: 1 });

            return;
        }

        const [column, row] = arrowNavigationMap[event.key as Direction]({
            x: refRange.column,
            y: refRange.row,
            maxX: columns.length,
            maxY: rows.length,
        }, event.ctrlKey || event.metaKey);

        onCellClick(event, row, column);
        setTimeout(() => focusCell(row, column), 50);
    }
}
