import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { FaChevronRight } from '$components/icons';
import { appModeState } from '$module:globals';
import { useConnections } from '$module:connections';
import { getDatabaseList, getTablesList } from '../queries';
import { TableView, updateTab } from '$module:tabs';
import { Select } from 'ui/components/Select';

export default function Breadcrumbs(tab: TableView) {
    const [isAdvanced] = useAtom(appModeState);
    const connection = useConnections(state => state.currentActiveConnection!);

    const { data: databases } = useQuery<string[]>({
        queryKey: ['databases', connection.id, isAdvanced],
        queryFn: () => getDatabaseList(connection.id, isAdvanced),
    });

    const { data: tables } = useQuery<string[]>({
        queryKey: ['tables', connection.id, tab.currentDatabase],
        queryFn: () => getTablesList(connection.id, tab.currentDatabase as string),
        enabled: Boolean(tab.currentDatabase)
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

        await updateTab(updatedTab);
    }

    async function onTableChange(table: string) {
        const updatedTab = { ...tab, currentTable: table };

        await updateTab(updatedTab);
    }

    const initialTable = tableOptions.find(option => option.value === tab.currentTable);
    const initialDatabase = databaseOptions.find(option => option.value === tab.currentDatabase);

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            {databaseOptions.length > 0 && (
                <>
                    <FaChevronRight />
                    <Select
                        uniqueKey="value"
                        initialValue={initialDatabase}
                        labelKey="label"
                        options={databaseOptions ?? []}
                        onChange={({ value }) => onDatabaseChange(value)}
                    />
                </>
            )}
            {tableOptions.length > 0 && (
                <>
                    <FaChevronRight />
                    <Select
                        uniqueKey="value"
                        initialValue={initialTable}
                        labelKey="label"
                        options={tableOptions ?? []}
                        onChange={({ value }) => onTableChange(value)}
                    />
                </>
            )}
        </div>
    );
}
