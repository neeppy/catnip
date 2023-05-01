import { KeyboardEvent, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DndContext, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
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

export function DynamicGrid({ rows, columns }: GridProps) {
    const [parentRef, size] = useNodeSize();
    const gridRef = useRef<VariableSizeGrid>(null);
    const focusTimeoutRef = useRef<any>(null);
    const [rangeStart, setRangeStart] = useState<RangePoint | null>(null);
    const [rangeEnd, setRangeEnd] = useState<RangePoint | null>(null);

    return (
        <DndContext onDragStart={onDragStart} onDragOver={onDragOver}>
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
                        itemData={{ rows, columns, onKeyboardNavigation, rangeStart, rangeEnd }}
                    >
                        {Cell}
                    </VariableSizeGrid>
                )}
            </div>
        </DndContext>
    );

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

        setTimeout(() => focusCell(row, column), 50);
    }

    function onDragStart(event: DragStartEvent) {
        setRangeStart(event.active.data.current as unknown as RangePoint);
        setRangeEnd(event.active.data.current as unknown as RangePoint);
    }

    function onDragOver(event: DragOverEvent) {
        if (event.over && rangeStart) {
            const { row, column } = event.over.data.current as unknown as RangePoint;

            if (rangeStart.row === row && rangeStart.column === column) return;

            setRangeEnd({ row, column });

            gridRef.current?.scrollToItem({
                align: 'smart',
                rowIndex: row,
                columnIndex: column,
            });

            focusTimeoutRef.current = setTimeout(() => focusCell(row, column), 50);
        }
    }
}
