import { useCallback, useReducer } from 'react';

interface PushAction<T> {
    type: 'push';
    payload: T;
}

interface Update<T> {
    type: 'update';
    index: number;
    payload: T;
}

interface DropAction {
    type: 'drop';
    index: number;
}

interface ClearAction {
    type: 'clear';
}

type Action<T> = PushAction<T> | DropAction | Update<T> | ClearAction;

function init<T>(initialState: T[]): T[] {
    return initialState;
}

function reducer<T>(state: T[], action: Action<T>): T[] {
    switch (action.type) {
        case 'push':
            return [...state, action.payload];
        case 'drop':
            // @ts-ignore: toSpliced added in chromium 110
            return state.toSpliced(action.index, 1);
        case 'update':
            // @ts-ignore: with added in chromium 110
            return state.with(action.index, action.payload);
        case 'clear':
            return [];
    }
}

export interface Collection<T> {
    push: (payload: T) => void;
    drop: (index: number) => void;
    update: (index: number, payload: T) => void;
    clear: () => void;
}

export function useCollection<T>(initialState: T[] = []) {
    const [state, dispatch] = useReducer(reducer<T>, initialState, init<T>);

    const push = useCallback((payload: T) => {
        dispatch({ type: 'push', payload });
    }, []);

    const drop = useCallback((index: number) => {
        dispatch({ type: 'drop', index });
    }, []);

    const update = useCallback((index: number, payload: T) => {
        dispatch({ type: 'update', index, payload });
    }, []);

    const clear = useCallback(() => {
        dispatch({ type: 'clear' });
    }, []);

    return [state, { push, drop, update, clear } as Collection<T>] as const;
}
