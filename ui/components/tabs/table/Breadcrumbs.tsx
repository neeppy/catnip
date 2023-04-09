import { useAtom } from 'jotai';
import { DropdownSelect } from 'ui-kit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaChevronRight } from 'react-icons/fa';
import { appModeState } from 'ui/state/global';
import { useConnections } from 'ui/components/connections';
import { getDatabaseList, getTablesList, updateTabs } from '../queries';
import { TableView, useTabActivity } from '../state';

export default function Breadcrumbs(tab: TableView) {
    const queryClient = useQueryClient();
    const [isAdvanced] = useAtom(appModeState);
    const connection = useConnections(state => state.currentActiveConnection!);
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);

    const { data: databases } = useQuery<string[]>(['databases', connection.id, isAdvanced], () => getDatabaseList(connection.id, isAdvanced));
    const { data: tables } = useQuery<string[]>(
        ['tables', connection.id, tab.currentDatabase],
        () => getTablesList(connection.id, tab.currentDatabase as string),
        { enabled: !!tab.currentDatabase }
    );

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
        await queryClient.refetchQueries(['tabs', connection.id]);
        updateCurrentTab(updatedTab);
    }

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            <FaChevronRight/>
            <DropdownSelect initialValue={tab.currentDatabase} placeholder="Choose a database" options={databaseOptions} onChange={onDatabaseChange}/>
            <FaChevronRight/>
            <DropdownSelect initialValue={tab.currentTable} placeholder="Choose a table" options={tableOptions ?? []} onChange={onTableChange}/>
        </div>
    );
}
