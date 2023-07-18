import { KeyboardEvent, MouseEvent, useContext } from 'react';
import { useContextMenu } from 'react-contexify';
import { TABLE_CELL_CONTEXT_MENU, TABLE_RANGE_CONTEXT_MENU } from '$module:globals';
import classnames from 'classnames';
import { MouseButton } from 'ui/utils/constants';
import { useBoolean } from 'ui/hooks';
import { ColumnType } from 'common/models/Database';
import { TableContext } from '../../context';
import { useCellDrag } from '../../useCellDrag';
import { doKeyboardNavigation, focusCell, isInRange } from '../../utils';
import { StringCell } from './StringCell';
import { EnumCell } from './EnumCell';
import { NumberCell } from './NumberCell';
import { DateTimeCell } from './DateTimeCell';

interface CellProps {
    width: number;
    height: number;
    row: number;
    column: number;
    scrollToElement: (row: number, column: number) => void;
}

const CELL_TYPE_COMPONENTS = {
    [ColumnType.String]: StringCell,
    [ColumnType.Enum]: EnumCell,
    [ColumnType.Number]: NumberCell,
    [ColumnType.Date]: DateTimeCell,
    [ColumnType.DateTime]: DateTimeCell,
};

export function Cell({ row, column, width, height, scrollToElement }: CellProps) {
    const { show, hideAll } = useContextMenu();
    const { rows, columns, allChanges, allRanges, change, range } = useContext(TableContext);
    const { boolean: isEditing, on: enableEditing, off: disableEditing } = useBoolean(false);
    const currentColumn = columns.at(column);

    if (!currentColumn) throw new Error('A cell without a column?! No can do, sir!');

    const initialColumnValue = rows[row][currentColumn.name];
    const cellChangeIndex = allChanges.findIndex(change => change.column === currentColumn.name && change.rowIndex === row);
    const isCellChanged = cellChangeIndex > -1;

    let currentColumnValue = initialColumnValue;

    if (isCellChanged) {
        currentColumnValue = allChanges[cellChangeIndex].newValue;
    }

    const [setNodeRef, props] = useCellDrag(row, column, isEditing);

    const isActive = allRanges.some(someRange => isInRange(row, column, someRange));

    const cellClass = classnames('relative px-2 py-1 flex items-center select-none shadow-[inset_0_0_1px_0] shadow-surface-800', {
        'bg-primary-600': isActive,
        'bg-surface-500': !isActive,
    });

    const CellTypeComponent = CELL_TYPE_COMPONENTS[currentColumn.type as keyof typeof CELL_TYPE_COMPONENTS] || StringCell;

    return (
        <div
            ref={setNodeRef}
            className={cellClass}
            data-row={row}
            data-col={column}
            style={{ width, height }}
            onMouseDown={onCellClick}
            onKeyDown={onKeyDown}
            onDoubleClick={enableEditing}
            onContextMenu={onCellRightClick}
            {...props}
        >
            {isEditing ? (
                <CellTypeComponent.Write
                    column={currentColumn}
                    currentValue={currentColumnValue}
                    onChange={onCellChange}
                    disableEditing={disableEditing}
                />
                ) : (
                <CellTypeComponent.Read column={currentColumn} currentValue={currentColumnValue} />
            )}
        </div>
    );

    function onCellChange(value: unknown) {
        if (isCellChanged && value === initialColumnValue) {
            change.drop(cellChangeIndex);
        } else if (isCellChanged) {
            change.update(cellChangeIndex, {
                rowIndex: row,
                column: currentColumn!.name,
                newValue: value,
                oldValue: initialColumnValue,
            });
        } else {
            change.push({
                rowIndex: row,
                column: currentColumn!.name,
                newValue: value,
                oldValue: initialColumnValue,
            });
        }
    }

    function onCellClick(event: MouseEvent) {
        if (event.button !== MouseButton.LeftClick) return;

        handleCellSelection(event);
    }

    function handleCellSelection(event: MouseEvent) {
        if (event.shiftKey) {
            range.expandCurrentRange(row, column);
        } else {
            range.selectSingleCell(row, column, event.ctrlKey || event.metaKey);
        }

        hideAll();
    }

    function onKeyDown(event: KeyboardEvent) {
        if (!event.key.startsWith('Arrow')) return;

        event.preventDefault();

        const [newCol, newRow] = doKeyboardNavigation(event, row, column, rows.length, columns.length, event.ctrlKey || event.metaKey);

        if (event.shiftKey) {
            range.expandCurrentRange(newRow, newCol);
        } else {
            range.selectSingleCell(newRow, newCol);
        }

        scrollToElement(newRow, newCol);
        setTimeout(() => focusCell(newRow, newCol), 50);
    }

    function onCellRightClick(event: MouseEvent) {
        const [firstRange] = allRanges;
        const isOnlyActive = isActive && allRanges.length === 1 &&
            firstRange.start.row === firstRange.end.row &&
            firstRange.start.column === firstRange.end.column;

        if (isActive && !isOnlyActive) {
            show({ event, id: TABLE_RANGE_CONTEXT_MENU });
        } else {
            if (!isActive) handleCellSelection(event);

            show({
                event,
                id: TABLE_CELL_CONTEXT_MENU,
                props: {
                    column: currentColumn,
                    editCell: enableEditing,
                    setCellValue: onCellChange,
                }
            });
        }
    }
}
