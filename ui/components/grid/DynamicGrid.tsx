import { KeyboardEvent, useRef } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DndContext, DragOverEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DatabaseColumn, DatabaseRow, QueryField } from 'common/models/Database';
import { useCollection, useNodeSize } from 'ui/hooks';
import { Cell, SelectionData, SelectionType } from './Cell';
import { arrowNavigationMap, Direction, focusCell, getRangeByTypeAndCoords } from './utils';
import { useRangeCollection } from './useRangeCollection';
import { CellChange } from './DataCell';

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
    const lastSelectionType = useRef<SelectionData['type']>('cell');
    const [allRanges, lastRange, range] = useRangeCollection();
    const [changes, collection] = useCollection<CellChange>([]);

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <DndContext onDragOver={onDragOver} sensors={sensors}>
            <div className="w-full h-full" ref={parentRef}>
                {size && (
                    <VariableSizeGrid
                        className="select-none"
                        ref={gridRef}
                        width={size.width}
                        height={size.height}
                        columnWidth={getColumnWidth}
                        rowHeight={() => 40}
                        columnCount={columns.length + 1}
                        rowCount={rows.length + 1}
                        itemData={{ allRanges, rows, columns, select, changes, collection, onKeyboardNavigation, selectAll }}
                    >
                        {Cell}
                    </VariableSizeGrid>
                )}
            </div>
        </DndContext>
    );

    function getColumnWidth(index: number) {
        let columnName;

        if (index === 0) {
            columnName = String(rows.length) + '00'; // add 2 digits, just in case
        } else {
            columnName = columns[index - 1].name;
        }

        return Math.min(columnName.length * 10 + 24, 240);
    }

    function select(type: SelectionType, row: number, column: number, isCtrlPressed?: boolean, isShiftPressed?: boolean) {
        lastSelectionType.current = type;

        if (!isCtrlPressed && !isShiftPressed) {
            const newRange = getRangeByTypeAndCoords(type, row, column, rows, columns);

            range.reset(newRange);
        } else if (isShiftPressed) {
            range.update({
                start: lastRange?.start || { row: 1, column: 1 },
                end: { row, column }
            });
        } else if (isCtrlPressed) {
            const newRange = getRangeByTypeAndCoords(type, row, column, rows, columns);

            range.create(newRange);
        }
    }

    function selectAll() {
        range.reset({
            start: { row: 1, column: 1 },
            end: { row: rows.length, column: columns.length }
        });
    }

    function onKeyboardNavigation(event: KeyboardEvent) {
        if (!lastRange) return;

        const refRange = event.shiftKey ? lastRange.end : lastRange.start;

        const [column, row] = arrowNavigationMap[event.key as Direction]({
            x: refRange.column,
            y: refRange.row,
            maxX: columns.length,
            maxY: rows.length
        }, event.ctrlKey || event.metaKey);

        // normal cell by cell navigation
        if (!event.shiftKey || (event.shiftKey && !lastRange.start)) {
            range.reset({
                start: { row, column },
                end: { row, column }
            });
        } else {
            // navigation with SHIFT (trailing selection)
            range.update({ end: { row, column } });
        }

        gridRef.current?.scrollToItem({
            columnIndex: column === 1 ? 0 : column,
            rowIndex: row === 1 ? 0 : row,
            align: 'smart'
        });

        setTimeout(() => focusCell(row, column), 50);
    }

    function onDragOver(event: DragOverEvent) {
        const activeData = event.active.data.current as SelectionData;
        const overData = event.over?.data.current as SelectionData;

        if (overData?.row === activeData.row && overData?.column === activeData.column) {
            return;
        }

        const rangeStart = lastRange?.start;

        clearTimeout(focusTimeoutRef.current);

        if (lastSelectionType.current === 'cell' && event.over && rangeStart) {
            const { row, column } = event.over.data.current as unknown as SelectionData;

            if (rangeStart.row === row && rangeStart.column === column) return;

            range.update({ end: { row, column } });

            gridRef.current?.scrollToItem({
                align: 'smart',
                rowIndex: row,
                columnIndex: column
            });

            return focusTimeoutRef.current = setTimeout(() => focusCell(row, column), 50);
        }

        if (lastSelectionType.current === 'row' && event.over && rangeStart) {
            const { row } = event.over.data.current as unknown as SelectionData;

            if (rangeStart.row === row) return;

            range.update({ end: { row, column: columns.length } });

            return focusTimeoutRef.current = setTimeout(() => focusCell(row, 1), 50);
        }

        if (lastSelectionType.current === 'column' && event.over && rangeStart) {
            const { column } = event.over.data.current as unknown as SelectionData;

            if (rangeStart.column === column) return;

            range.update({ end: { row: rows.length, column } });

            return focusTimeoutRef.current = setTimeout(() => focusCell(1, column), 50);
        }
    }
}
