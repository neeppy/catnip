import { Range } from './useRangeCollection';
import { SelectionType } from './Cell';

export type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
type DirectionalFunction = (params: {
    x: number;
    y: number;
    maxX: number;
    maxY: number;
}, toMax?: boolean) => [number, number];


export const arrowNavigationMap: Record<Direction, DirectionalFunction> = {
    ArrowUp({ x, y }, toMax) {
        if (y === 0) return [x, y];

        return [x, toMax ? 1 : Math.max(1, y - 1)];
    },
    ArrowDown({ x, y, maxY }, toMax) {
        if (y === maxY) return [x, y];

        return [x, toMax ? maxY : Math.min(maxY, y + 1)];
    },
    ArrowLeft({ x, y }, toMax) {
        if (x === 0) return [x, y];

        return [toMax ? 1 : Math.max(1, x - 1), y];
    },
    ArrowRight({ x, y, maxX }, toMax) {
        if (x === maxX) return [x, y];

        return [toMax ? maxX : Math.min(maxX, x + 1), y];
    }
};

export function focusCell(rowIndex: number, colIndex: number) {
    const element = document.querySelector(`[data-row='${rowIndex || 1}'][data-col='${colIndex || 1}']`) as HTMLElement;

    element.focus();
}

const isBetween = (value: number, start: number, end: number) => value >= Math.min(start, end) && value <= Math.max(start, end);

export function isInRange(row: number, column: number, range: Range) {
    const { start, end } = range;

    const isRowActive = isBetween(row, start.row, end.row);
    const isColActive = isBetween(column, start.column, end.column);

    return isRowActive && isColActive;
}

export function getRangeByTypeAndCoords(type: SelectionType, row: number, column: number, rows: unknown[], columns: unknown[]): Range {
    switch (type) {
        case 'cell':
            return {
                start: { row, column },
                end: { row, column }
            };
        case 'row':
            return {
                start: { row, column: 1 },
                end: { row, column: columns.length }
            };
        case 'column':
            return {
                start: { row: 1, column },
                end: { row: rows.length, column }
            };
    }
}
