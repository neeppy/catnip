import { KeyboardEvent, MouseEvent, useRef } from 'react';
import { GridChildComponentProps } from 'react-window';
import { useContextMenu } from 'react-contexify';
import classnames from 'classnames';
import { DatabaseColumn } from 'common/models/Database';
import { useBoolean, useControlledEffect } from 'ui/hooks';
import { TABLE_CELL_CONTEXT_MENU, TABLE_RANGE_CONTEXT_MENU } from '$module:globals';
import { fnMerge } from 'ui/utils/functions';
import { MouseButton } from 'ui/utils/constants';
import type { CellProps } from './Cell';
import { focusCell, isInRange } from './utils';
import { useCellComponent } from './editable/useCellComponent';
import { useCellDrag } from './useCellDrag';

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

    const { show, hideAll } = useContextMenu();
    const { boolean: isEditable, on: enableEditing, off: disableEditing } = useBoolean(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [setNodeRef, props] = useCellDrag(rowIndex, columnIndex, isEditable);
    const CellComponent = useCellComponent(column);

    const isActive = allRanges.some(range => isInRange(rowIndex, columnIndex, range));

    const changeIndex = changes.findIndex(change => change.rowIndex === rowIndex && key === change.column);
    const isChanged = changeIndex > -1;

    let currentValue = rows[rowIndex - 1][key];

    if (isChanged) {
        currentValue = changes[changeIndex].newValue;
    }

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
            onContextMenu={handleContextMenu}
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
        const initialValue = rows[rowIndex - 1][key];

        if (value === initialValue) {
            collection.drop(changeIndex);
        } else if (isChanged) {
            collection.update(changeIndex, { rowIndex, column: key, oldValue: initialValue, newValue: value });
        } else {
            collection.push({ rowIndex, column: key, oldValue: initialValue, newValue: value });
        }
    }

    function handleDoubleClick(e: MouseEvent) {
        select('cell', rowIndex, columnIndex);

        enableEditing();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            disableEditing();
            onKeyboardNavigation(e);
        } else if (e.key.length === 1) {
            if (e.ctrlKey || e.metaKey) return;

            e.preventDefault();
            enableEditing();
        }
    }

    function handleCellClick(event: MouseEvent) {
        console.debug('[Generic Cell]', 'focused', column);

        if (event.button === MouseButton.LeftClick) {
            select('cell', rowIndex, columnIndex, event.ctrlKey || event.metaKey, event.shiftKey);

            hideAll();
        }
    }

    function handleContextMenu(event: MouseEvent) {
        const sharedContextMenuData = {
            rows,
            columns,
            column,
        };

        const cellContextMenuData = {
            ...sharedContextMenuData,
            enableEditing,
            setCellValue: handleCellChange,
        };

        if (!isActive) {
            select('cell', rowIndex, columnIndex, event.ctrlKey || event.metaKey, event.shiftKey);

            show({
                event,
                id: TABLE_CELL_CONTEXT_MENU,
                props: cellContextMenuData,
            });
        } else if (isOnlyActive) {
            show({
                event,
                id: TABLE_CELL_CONTEXT_MENU,
                props: cellContextMenuData,
            });
        } else {
            show({
                event,
                id: TABLE_RANGE_CONTEXT_MENU,
                props: sharedContextMenuData,
            });
        }
    }
}
