import { useAtom } from 'jotai';
import { DropdownSelect } from '$components';
import { useQuery } from '@tanstack/react-query';
import { FaChevronRight } from 'react-icons/fa';
import { appModeState } from '$module:globals';
import { isMultiDatabaseConnection, useConnections } from '$module:connections';
import { getDatabaseList, getTablesList } from '../queries';
import { TableView, updateTabs, useTabActivity } from '$module:tabs';

export default function Breadcrumbs(tab: TableView) {
    const [isAdvanced] = useAtom(appModeState);
    const connection = useConnections(state => state.currentActiveConnection!);
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);

    const isMultiDatabase = isMultiDatabaseConnection(connection);

    const { data: databases } = useQuery<string[]>({
        queryKey: ['databases', connection.id, isAdvanced],
        queryFn: () => getDatabaseList(connection.id, isAdvanced),
        enabled: isMultiDatabase
    });

    const { data: tables } = useQuery<string[]>({
        queryKey: ['tables', connection.id, tab.currentDatabase],
        queryFn: () => getTablesList(connection.id, tab.currentDatabase as string, isMultiDatabase),
        enabled: Boolean(tab.currentDatabase) || !isMultiDatabase
    });

    const databaseOptions = databases?.map(dbName => ({
        label: dbName,
        value: dbName
    })) ?? [];

    const tableOptions = tables?.map(table => ({
        label: table,
        value: table
    })) ?? [];

    async function onDatabaseChange(database: string) {
        const updatedTab = {
            ...tab,
            currentDatabase: database,
            currentTable: null
        };

        await updateTabs([updatedTab]);
        updateCurrentTab(updatedTab);
    }

    async function onTableChange(table: string) {
        const updatedTab = { ...tab, currentTable: table };

        await updateTabs([updatedTab]);
        updateCurrentTab(updatedTab);
    }

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            {isMultiDatabase && (
                <>
                    <FaChevronRight/>
                    <DropdownSelect initialValue={tab.currentDatabase} placeholder="Choose a database" options={databaseOptions} onChange={onDatabaseChange}/>
                </>
            )}
            <FaChevronRight/>
            <DropdownSelect initialValue={tab.currentTable} placeholder="Choose a table" options={tableOptions ?? []} onChange={onTableChange}/>
        </div>
    );
}
