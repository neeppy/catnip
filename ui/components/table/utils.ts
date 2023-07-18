import { KeyboardEvent, MouseEvent } from 'react';
import { Active, Over } from '@dnd-kit/core';
import { Range } from './useRangeCollection';

export type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

type DirectionalFunction = (params: {
    x: number;
    y: number;
    maxX: number;
    maxY: number;
}, toMax?: boolean) => [number, number];

export function isSameCell(active: Active, over: Over | null) {
    return String(over?.id) === `${String(active.id)}-drop`;
}

export const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function isInRange(row: number, column: number, range: Range) {
    const { start, end } = range;

    const isRowActive = isBetween(row, start.row, end.row);
    const isColActive = isBetween(column, start.column, end.column);

    return isRowActive && isColActive;
}

const arrowNavigationMap: Record<Direction, DirectionalFunction> = {
    ArrowUp({ x, y }, toMax) {
        if (y === 0) return [x, y];

        return [x, toMax ? 0 : Math.max(0, y - 1)];
    },
    ArrowDown({ x, y, maxY }, toMax) {
        if (y === maxY) return [x, y];

        return [x, toMax ? maxY : Math.min(maxY, y + 1)];
    },
    ArrowLeft({ x, y }, toMax) {
        if (x === 0) return [x, y];

        return [toMax ? 0 : Math.max(0, x - 1), y];
    },
    ArrowRight({ x, y, maxX }, toMax) {
        if (x === maxX) return [x, y];

        return [toMax ? maxX : Math.min(maxX, x + 1), y];
    }
};

export function doKeyboardNavigation(event: KeyboardEvent, row: number, column: number, countRows: number, countColumns: number, ctrlKey?: boolean) {
    const navigationFn = arrowNavigationMap[event.key as keyof typeof arrowNavigationMap];

    const coordinates = navigationFn?.({
        x: column,
        y: row,
        maxX: countColumns - 1,
        maxY: countRows - 1,
    }, ctrlKey);

    return coordinates;
}

export function focusCell(rowIndex: number, colIndex: number) {
    const element = document.querySelector(`[data-row='${rowIndex || 0}'][data-col='${colIndex || 0}']`) as HTMLElement;

    element.focus();
}
