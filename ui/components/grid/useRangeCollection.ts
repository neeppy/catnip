import { RangePoint } from '$components';
import { useCallback, useReducer } from 'react';

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

    const lastRange = state.at(-1);

    return [state, lastRange, { create, update, reset }] as const;
}
