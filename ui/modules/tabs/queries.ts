import { arrayMove } from '@dnd-kit/sortable';
import storage from '$storage';
import client from 'ui/utils/query';
import { AnyTab, EditorView, TableView, useTabActivity } from './state';

async function getDefaultOrder(connectionId: string) {
    const defaultOrder = await storage.tabs.where('connectionId')
        .equals(connectionId)
        .count();

    return defaultOrder + 1;
}

export async function getConnectionTabs(connectionId: string) {
    return storage.tabs.where('connectionId')
        .equals(connectionId)
        .sortBy('order');
}

export async function reorderTabs(connectionId: string, fromIndex: number, toIndex: number) {
    const tabs = await getConnectionTabs(connectionId);

    const reordered = arrayMove(tabs, fromIndex, toIndex)
        .map((tab, idx) => ({
            ...tab,
            order: idx + 1
        }));

    await storage.tabs.bulkPut(reordered);
    await client.refetchQueries(['tabs', connectionId]);
}

export async function createEmptyTableView(connectionId: string, initialDatabase?: string) {
    const tab: TableView = {
        id: window.crypto.randomUUID(),
        connectionId: connectionId,
        name: 'New Tab',
        type: 'table',
        order: await getDefaultOrder(connectionId),
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
        order: await getDefaultOrder(connectionId),
        currentDatabase: initialDatabase || null,
        currentQuery: null
    };

    await storage.tabs.add(tab);
    await client.refetchQueries(['tabs', connectionId]);
    useTabActivity.getState().setCurrentTab(tab);

    return tab;
}

export async function updateTab(tab: AnyTab) {
    return storage.tabs.bulkPut([tab])
        .then(() => client.refetchQueries(['tabs', tab.connectionId]))
        .then(() => useTabActivity.getState().updateCurrentTabDetails(tab));
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
