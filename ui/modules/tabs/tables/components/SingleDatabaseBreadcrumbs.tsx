import { useQuery } from '@tanstack/react-query';
import { FaChevronRight } from '$components/icons';
import { Select } from '$components';
import { useConnections } from '$module:connections';
import { TableView, updateTab } from '$module:tabs';
import { getTablesList } from '../queries';
import { useGlobalEditor } from 'ui/modules/globals';

export default function SingleDatabaseBreadcrumbs(tab: TableView) {
    const globalEditor = useGlobalEditor();
    const connection = useConnections(state => state.currentActiveConnection!);

    const { data: tables } = useQuery<string[]>({
        queryKey: ['tables', tab.connectionId],
        queryFn: () => getTablesList(tab.connectionId)
    });

    const tableOptions = tables?.map(table => ({
        label: table,
        value: table
    })) ?? [];

    async function onTableChange(table: string) {
        const updatedTab = { ...tab, currentTable: table };

        await updateTab(updatedTab);

        globalEditor.setValue(`SELECT * FROM ${table}`);
    }

    const initialTable = tableOptions.find(option => option.value === tab.currentTable);

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            <FaChevronRight/>
            {tableOptions.length > 0 && (
                <Select
                    uniqueKey="value"
                    initialValue={initialTable}
                    labelKey="label"
                    options={tableOptions ?? []}
                    onChange={({ value }) => onTableChange(value)}
                />
            )}
        </div>
    );
}
