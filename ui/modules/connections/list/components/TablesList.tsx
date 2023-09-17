import { useQuery } from '@tanstack/react-query';
import { AnyConnection } from 'common/models/Connection';
import { getTablesList } from '$module:tabs/tables';
import { openNewTab } from 'ui/modules/tabs';

interface OwnProps {
    focusedConnection: AnyConnection;
    close: VoidFn;
}

export function TablesList({
    focusedConnection,
    close,
}: OwnProps) {
    const { data: tables, isLoading: isFetchingTables } = useQuery({
        queryKey: ['tables', focusedConnection],
        queryFn: () => getTablesList(focusedConnection?.id ?? ''),
    });

    return (
        <div className="bg-base-400 w-64 p-4">
            <h3 className="text-lg font-medium">{focusedConnection.name}</h3>
            <ul className="mt-5 flex flex-col gap-1">
                {tables && tables.length > 0 && tables.map(table => (
                    <li key={table} className="w-full">
                        <button
                            className="w-full p-1 hover:bg-transparent-400 focus:bg-transparent-300 cursor-pointer select-none rounded-sm text-left"
                            onDoubleClick={() => onLoadTable(table)}
                        >
                            {table}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    async function onLoadTable(table: string) {
        await openNewTab(focusedConnection.id, `SELECT * FROM ${table}`, true);

        close();
    }
}
