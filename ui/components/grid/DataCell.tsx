import { KeyboardEvent, MouseEvent, useRef } from 'react';
import { GridChildComponentProps } from 'react-window';
import classnames from 'classnames';
import { useBoolean, useControlledEffect } from 'ui/hooks';
import { fnMerge } from 'ui/utils/functions';
import type { CellProps } from './Cell';
import { focusCell, isInRange } from './utils';
import { useCellComponent } from './editable/useCellComponent';
import { useCellDrag } from './useCellDrag';
import { DatabaseColumn } from 'common/models/Database';

export interface CellChange {
    rowIndex: number;
    column: string;
    oldValue: unknown;
    newValue: unknown;
}

export function DataCell({ rowIndex, columnIndex, data, style }: GridChildComponentProps<CellProps>) {
    const { allRanges, rows, columns, select, changes, collection, onKeyboardNavigation } = data;
    const column = columns[columnIndex - 1];
    const key = column.name;

    const { boolean: isEditable, on: enableEditing, off: disableEditing } = useBoolean(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [setNodeRef, props] = useCellDrag(rowIndex, columnIndex, isEditable);
    const CellComponent = useCellComponent(column);

    const isActive = allRanges.some(range => isInRange(rowIndex, columnIndex, range));

    const changeIndex = changes.findIndex(change => change.rowIndex === rowIndex && key === change.column);
    const valueFromChanges = changeIndex === -1 ? null : changes[changeIndex].newValue;
    const currentValue = (valueFromChanges || rows[rowIndex - 1][key]) ?? null;

    const firstRange = allRanges[0];
    const isOnlyActive = isActive && allRanges.length === 1 &&
        firstRange.start.row === firstRange.end.row &&
        firstRange.start.column === firstRange.end.column;

    const cellClass = classnames(['flex items-center px-3 relative text-sm text-foreground-default border-surface-700 border-br duration-200 ease-out'], {
        'bg-primary-600': isActive,
        'shadow-lg z-10 border-none': isOnlyActive,
        'bg-surface-500 border-br': !isActive,
    });

    useControlledEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }, 100);
    }, isEditable);

    return (
        <div
            ref={setNodeRef}
            className={cellClass} style={style}
            data-row={rowIndex}
            data-col={columnIndex}
            onKeyDown={isEditable ? undefined : handleKeyDown}
            onMouseDown={handleCellClick}
            onDoubleClick={handleDoubleClick}
            {...props}
        >
            <CellComponent
                currentValue={currentValue}
                isEditable={isEditable}
                inputRef={inputRef}
                className="bg-transparent absolute inset-0 px-3"
                column={column as DatabaseColumn}
                onChange={handleCellChange}
                disableEditing={fnMerge(disableEditing, () => focusCell(rowIndex, columnIndex))}
            />
        </div>
    );

    function handleCellChange(value: unknown) {
        if (valueFromChanges) {
            collection.update(changeIndex, { rowIndex, column: key, oldValue: currentValue, newValue: value });
        } else {
            collection.push({ rowIndex, column: key, oldValue: currentValue, newValue: value });
        }
    }

    function handleDoubleClick(e: MouseEvent) {
        select('cell', rowIndex, columnIndex);

        enableEditing();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.ctrlKey || e.metaKey) return;

        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            disableEditing();
            onKeyboardNavigation(e);
        } else if (e.key.length === 1) {
            e.preventDefault();
            enableEditing();
        }
    }

    function handleCellClick(e: MouseEvent) {
        console.debug('[Generic Cell]', 'focused', column);
        console.debug('[Generic Cell]', valueFromChanges, rows[rowIndex - 1][key]);

        select('cell', rowIndex, columnIndex, e.ctrlKey || e.metaKey, e.shiftKey);
    }
}
