import { create } from 'zustand';

interface Tab {
    id: string;
    connectionId: string;
    name: string;
    type: 'table' | 'editor';
    order: number;
}

export interface TableView extends Tab {
    type: 'table';
    currentDatabase: string | null;
    currentTable: string | null;
}

export interface EditorView extends Tab {
    type: 'editor';
    currentDatabase: string | null;
    currentQuery: string | null;
}

export type AnyTab = TableView | EditorView;

interface UseTabActivity {
    currentActiveTab: AnyTab | null;
    previousActiveTab: AnyTab | null;
    setCurrentTab: (tab: AnyTab, reset?: boolean) => void;
    updateCurrentTabDetails: (tab: AnyTab) => void;
}

export const useTabActivity = create<UseTabActivity>(set => ({
    currentActiveTab: null,
    previousActiveTab: null,
    setCurrentTab: (tab, reset) => {
        const activeTabMap = JSON.parse(localStorage.getItem('activeTab') || '{}');

        activeTabMap[tab.connectionId] = tab.id;

        localStorage.setItem('activeTab', JSON.stringify(activeTabMap));

        set(prevState => ({
            currentActiveTab: tab,
            previousActiveTab: reset ? null : prevState.currentActiveTab
        }));
    },
    updateCurrentTabDetails: tab => set(prevState => ({
        currentActiveTab: {
            ...prevState.currentActiveTab,
            ...tab
        },
    })),
}));
