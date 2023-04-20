import storage from '$storage';
import { AnyTab, EditorView, TableView, useTabActivity } from './state';
import client from 'ui/utils/query';

const advancedDbNames = [
    'information_schema',
    'mysql',
    'performance_schema',
    'sys'
];

export async function getTableColumns(connectionId: string, database: string, table: string) {
    return interop.database.fetchTableColumns(connectionId, database, table);
}

export async function getTableRows(connectionId: string, database: string | null, table: string) {
    return interop.database.fetchTableContent(connectionId, database, table);
}

export async function getConnectionTabs(connectionId: string) {
    return storage.tabs.where('connectionId')
        .equals(connectionId)
        .toArray();
}

export async function createEmptyTableView(connectionId: string, initialDatabase?: string) {
    const tab: TableView = {
        id: window.crypto.randomUUID(),
        connectionId: connectionId,
        name: 'New Tab',
        type: 'table',
        currentDatabase: initialDatabase ?? null,
        currentTable: null,
    };

    await storage.tabs.add(tab);
    await client.refetchQueries(['tabs', connectionId]);
    useTabActivity.getState().setCurrentTab(tab);

    return tab;
}

export async function createEmptyEditorView(connectionId: string, initialDatabase?: string) {
    const tab: EditorView = {
        id: window.crypto.randomUUID(),
        connectionId,
        name: 'New Tab',
        type: 'editor',
        currentDatabase: initialDatabase || null,
        currentQuery: null
    };

    await storage.tabs.add(tab);
    await client.refetchQueries(['tabs', connectionId]);
    useTabActivity.getState().setCurrentTab(tab);

    return tab;
}

export async function createEditorViewFromQuery(connectionId: string, query: string, database?: string) {
    const tab: EditorView = {
        id: window.crypto.randomUUID(),
        connectionId,
        name: 'New Tab',
        type: 'editor',
        currentDatabase: database || null,
        currentQuery: query
    };

    await storage.tabs.add(tab);
    await client.refetchQueries(['tabs', connectionId]);
    useTabActivity.getState().setCurrentTab(tab);

    return tab;
}

export async function getDatabaseList(connectionId: string, isAdvanced: boolean = false) {
    if (!connectionId) {
        return [];
    }

    const databases = await interop.connections.listDatabases(connectionId);

    if (!isAdvanced) {
        return databases.filter(db => !advancedDbNames.includes(db));
    }

    return databases;
}

export async function getTablesList(connectionId: string, database?: string, isMultiDatabase?: boolean) {
    if (!connectionId) return [];
    if (!database && isMultiDatabase) return [];

    return interop.database.fetchTableNames(connectionId, database || '');
}

export async function updateTabs(tabs: AnyTab[]) {
    if (tabs.length === 0) return;

    return storage.tabs.bulkPut(tabs)
        .then(() => client.refetchQueries(['tabs', tabs[0].connectionId]));
}

export async function resumeTabActivity(connectionId: string) {
    const lastActiveTabs = JSON.parse(localStorage.getItem('activeTab') ?? '{}');

    if (lastActiveTabs[connectionId]) {
        const tab = await storage.tabs.get(lastActiveTabs[connectionId]);

        tab && useTabActivity.getState().setCurrentTab(tab);
    }
}

export async function closeTabs(connectionId: string, tabs: string[]) {
    if (tabs.length === 0) return;

    const currentActiveTab = useTabActivity.getState().currentActiveTab!;
    const previousActiveTab = useTabActivity.getState().previousActiveTab;

    const currentTabs = await client.fetchQuery(['tabs', connectionId], () => getConnectionTabs(connectionId)) as AnyTab[];
    const isClosingActive = tabs.includes(currentActiveTab.id);

    await storage.tabs.bulkDelete(tabs);

    if (currentTabs.length > 1 && isClosingActive) {
        useTabActivity.getState().setCurrentTab(previousActiveTab ?? currentTabs[0], true);
    } else if (currentTabs.length === 1) {
        await createEmptyTableView(connectionId);
    }

    await client.refetchQueries(['tabs', connectionId]);
}

export async function runUserQuery(connectionId: string, query: string, database?: string) {
    return interop.database.runUserQuery(connectionId, database || '', query);
}
