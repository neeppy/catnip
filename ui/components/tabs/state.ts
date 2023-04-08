import { atom } from 'jotai';
import { Connection } from 'common/models/Connection';

interface Tab {
    id: string;
    connectionId: string;
    name: string;
    type: 'table' | 'editor';
    isActive: boolean;
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

export const activeConnection = atom<Connection | null>(null);
