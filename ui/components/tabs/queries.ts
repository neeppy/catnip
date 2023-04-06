import storage from '$storage';
import { AnyTab, EditorView, TableView } from './state';
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

export async function getTableRows(connectionId: string, database: string, table: string) {
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
        isActive: true,
        currentDatabase: initialDatabase ?? null,
        currentTable: null,
    };

    await storage.tabs.add(tab);

    return tab;
}

export async function createEditorViewFromQuery(connectionId: string, database: string, query: string) {
    const tab: EditorView = {
        id: window.crypto.randomUUID(),
        connectionId,
        name: 'New Tab',
        type: 'editor',
        isActive: true,
        currentDatabase: database,
        currentQuery: query
    };

    await storage.tabs.add(tab);

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

export async function getTablesList(connectionId: string, database: string) {
    if (!connectionId || !database) {
        return [];
    }

    return interop.database.fetchTableNames(connectionId, database);
}

export async function updateTabs(tabs: AnyTab[]) {
    if (tabs.length === 0) return;

    return storage.tabs.bulkPut(tabs)
        .then(() => client.refetchQueries(['tabs', tabs[0].connectionId]));
}

export async function closeTabs(connectionId: string, tabs: string[]) {
    if (tabs.length === 0) return;

    const currentTabs = await client.fetchQuery(['tabs', connectionId], () => getConnectionTabs(connectionId)) as AnyTab[];
    const activeTab = currentTabs.find(tab => tab.isActive) as AnyTab;
    const isClosingActive = tabs.includes(activeTab.id);

    await storage.tabs.bulkDelete(tabs);

    if (currentTabs.length > 1 && isClosingActive) {
        const currentActiveIndex = currentTabs.indexOf(activeTab);
        const newTabIndex = currentActiveIndex === 0 ? 1 : Math.max(currentActiveIndex - 1, 0);

        const newActiveTab = currentTabs[newTabIndex];

        await updateTabs([{
            ...newActiveTab,
            isActive: true
        }]);
    } else if (currentTabs.length === 1) {
        await createEmptyTableView(connectionId);
        await client.refetchQueries(['tabs', connectionId]);
    } else {
        await client.refetchQueries(['tabs', connectionId]);
    }
}

export async function runUserQuery(connectionId: string, database: string, query: string) {
    return interop.database.runUserQuery(connectionId, database, query);
}
