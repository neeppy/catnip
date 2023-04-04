import storage from '$storage';
import { AnyTab, TableView } from './state';
import client from 'ui/utils/query';

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

export async function createEmptyTab(connectionId: string, initialDatabase?: string) {
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

export async function getDatabaseList(connectionId: string) {
    if (!connectionId) {
        return [];
    }

    return interop.connections.listDatabases(connectionId);
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
        await createEmptyTab(connectionId);
        await client.refetchQueries(['tabs', connectionId]);
    } else {
        await client.refetchQueries(['tabs', connectionId]);
    }
}
