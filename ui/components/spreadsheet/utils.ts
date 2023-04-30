import { DragEvent, SyntheticEvent } from 'react';

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
    const element = document.querySelector(`[data-row='${rowIndex}'][data-col='${colIndex}']`) as HTMLElement;

    element.focus();
}

export function getCellRowAndColumnFromEvent(event: SyntheticEvent) {
    const target = event.target as HTMLElement;

    const rowIndex = target.getAttribute('data-row-index');
    const colName = target.getAttribute('data-col-name');

    return [rowIndex, colName];
}

export function throttleByEventTarget(fn: Function) {
    let lastDraggedOver: HTMLElement;

    return function(event: DragEvent) {
        const target = event.target as HTMLElement;

        if (lastDraggedOver === target) return;

        if (target.draggable) {
            event.dataTransfer.setDragImage(new Image(), 0, 0);

            fn(event, target);
        }

        lastDraggedOver = target;
    }
}
