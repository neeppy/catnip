import { DragEvent, SyntheticEvent } from 'react';

type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
type DirectionalFunction = (params: {
    x: number;
    y: number;
    maxX: number;
    maxY: number;
}) => [number, number];


export const arrowNavigationMap: Record<Direction, DirectionalFunction> = {
    ArrowUp({ x, y }) {
        if (y === 0) return [x, y];

        return [x, Math.max(0, y - 1)];
    },
    ArrowDown({ x, y, maxY }) {
        if (y === maxY) return [x, y];

        return [x, Math.min(maxY, y + 1)];
    },
    ArrowLeft({ x, y }) {
        if (x === 0) return [x, y];

        return [Math.max(0, x - 1), y];
    },
    ArrowRight({ x, y, maxX }) {
        if (x === maxX) return [x, y];

        return [Math.min(maxX, x + 1), y];
    }
};

export function focusCell(rowIndex: number, colName: string) {
    const element = document.querySelector(`[data-row-index='${rowIndex}'][data-col-name='${colName}']`) as HTMLElement;

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
