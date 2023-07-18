import { useCallback, useReducer } from 'react';

export interface RangePoint {
    row: number;
    column: number;
}

export interface Range {
    start: RangePoint;
    end: RangePoint;
}

type State = Range[];
type Action = {
    type: 'update' | 'add' | 'reset';
    payload: any;
};

function init() {
    return [];
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'update':
            const lastElement = state.at(-1);

            return state.slice(0, state.length - 1).concat({
                ...lastElement,
                ...action.payload,
            });
        case 'reset':
            return [action.payload];
    }
}

export function useRangeCollection() {
    const [state, dispatch] = useReducer(reducer, [], init);

    const create = useCallback((range: Range) => {
        dispatch({
            type: 'add',
            payload: range,
        });
    }, []);

    const update = useCallback((range: Partial<Range>) => {
        dispatch({
            type: 'update',
            payload: range,
        });
    }, []);

    const reset = useCallback((range: Range) => {
        dispatch({
            type: 'reset',
            payload: range
        });
    }, []);

    const selectSingleCell = useCallback((row: number, column: number, shouldCreateNew?: boolean) => {
        if (shouldCreateNew) {
            create({
                start: { row, column },
                end: { row, column },
            });
        } else {
            reset({
                start: { row, column },
                end: { row, column },
            });
        }
    }, []);

    const expandCurrentRange = useCallback((row: number, column: number) => {
        update({ end: { row, column } });
    }, []);

    const selectSingleRange = useCallback((start: [number, number], end: [number, number], shouldCreateNew?: boolean) => {
        if (shouldCreateNew) {
            create({
                start: {
                    row: start[0],
                    column: start[1],
                },
                end: {
                    row: end[0],
                    column: end[1],
                },
            });
        } else {
            reset({
                start: {
                    row: start[0],
                    column: start[1],
                },
                end: {
                    row: end[0],
                    column: end[1],
                },
            });
        }
    }, []);

    return [state as Range[], { create, update, reset, selectSingleCell, expandCurrentRange, selectSingleRange }] as const;
}
