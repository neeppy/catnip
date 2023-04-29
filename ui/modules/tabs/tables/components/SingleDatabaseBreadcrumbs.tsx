import { useQuery } from '@tanstack/react-query';
import { FaChevronRight } from 'react-icons/fa';
import { DropdownSelect } from '$components';
import { useConnections } from '$module:connections';
import { TableView, updateTabs, useTabActivity } from '$module:tabs';
import { getTablesList } from '../queries';

export default function SingleDatabaseBreadcrumbs(tab: TableView) {
    const connection = useConnections(state => state.currentActiveConnection!);
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);

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

        await updateTabs([updatedTab]);
        updateCurrentTab(updatedTab);
    }

    return (
        <div className="inline-flex items-center gap-2 p-2 rounded-br-2xl">
            <div className="px-4">
                {connection.name}
            </div>
            <FaChevronRight/>
            <DropdownSelect initialValue={tab.currentTable} placeholder="Choose a table" options={tableOptions ?? []} onChange={onTableChange}/>
        </div>
    );
}
