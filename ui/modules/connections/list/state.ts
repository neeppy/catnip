import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

interface UseConnectionOrder {
    order: string[];
    reorder: (old: string, replaceWith: string) => void;
    drop: (ids: string[]) => void;
    push: (ids: string[]) => void;
    reset: (ids: string[]) => void;
}

const KEY = 'connection-order';

const initialValue = JSON.parse(localStorage.getItem(KEY) || '[]');

export const useConnectionOrder = create<UseConnectionOrder>(set => ({
    order: initialValue,
    reorder(old, replaceWith) {
        set(prev => {
            const oldIndex = prev.order.indexOf(old);
            const newIndex = prev.order.indexOf(replaceWith);

            const newOrder = arrayMove(prev.order, oldIndex, newIndex);

            localStorage.setItem(KEY, JSON.stringify(newOrder));

            return { order: newOrder };
        });
    },
    drop: ids => set(prev => {
        const newOrder = prev.order.filter(connId => !ids.includes(connId));

        localStorage.setItem(KEY, JSON.stringify(newOrder));

        return { order: newOrder };
    }),
    push: ids => set(prev => {
        const newOrder = [...prev.order, ...ids];

        localStorage.setItem(KEY, JSON.stringify(newOrder));

        return { order: newOrder };
    }),
    reset: ids => {
        localStorage.setItem(KEY, JSON.stringify(ids));
        set({ order: ids });
    }
}));
