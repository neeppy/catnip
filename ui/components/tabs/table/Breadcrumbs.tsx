import { useAtom } from 'jotai';
import { Dropdown } from 'ui-kit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaChevronRight } from 'react-icons/fa';
import { appModeState } from 'ui/state/global';
import { activeConnection, TableView } from '../state';
import { getDatabaseList, getTablesList, updateTabs } from 'ui/components/tabs';
import useNullableAtom from 'ui/hooks/useNullableAtom';

export default function Breadcrumbs(tab: TableView) {
    const queryClient = useQueryClient();
    const [isAdvanced] = useAtom(appModeState);
    const [connection] = useNullableAtom(activeConnection);

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
        await updateTabs([{
            ...tab,
            currentDatabase: database,
            currentTable: null
        }]);
    }

    async function onTableChange(table: string) {
        await updateTabs([{ ...tab, currentTable: table }]);
        await queryClient.refetchQueries(['tabs', connection.id]);
    }

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            <FaChevronRight/>
            <Dropdown initialValue={tab.currentDatabase} placeholder="Choose a database" options={databaseOptions} onChange={onDatabaseChange}/>
            <FaChevronRight/>
            <Dropdown initialValue={tab.currentTable} placeholder="Choose a table" options={tableOptions ?? []} onChange={onTableChange}/>
        </div>
    );
}
