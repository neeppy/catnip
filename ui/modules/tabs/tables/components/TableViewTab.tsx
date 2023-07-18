import { useQuery } from '@tanstack/react-query';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import { isMultiDatabaseConnection, useConnections } from '$module:connections';
import { TableView } from '$module:tabs';
import { getTableColumns, getTableRows } from '../queries';
import Breadcrumbs from './Breadcrumbs';
import { Change, Table } from 'ui/components/table';

export function TableViewTab({ connectionId, currentDatabase, currentTable, ...rest }: TableView) {
    const connection = useConnections(state => state.currentActiveConnection!);
    const isMultiDatabase = isMultiDatabaseConnection(connection);

    const { data: columns } = useQuery<DatabaseColumn[]>({
        queryKey: ['columns', currentDatabase, currentTable],
        queryFn: () => getTableColumns(connectionId, currentDatabase as string, currentTable as string),
        enabled: isMultiDatabase ? Boolean(currentDatabase && currentTable) : Boolean(currentTable)
    });

    const { data: rows } = useQuery<DatabaseRow[]>({
        queryKey: ['rows', currentDatabase, currentTable],
        queryFn: () => getTableRows(connectionId, currentDatabase, currentTable as string),
        enabled: isMultiDatabase ? Boolean(currentDatabase && currentTable) : Boolean(currentTable)
    });

    return (
        <div className="text-foreground-default grid grid-cols-table grid-rows-table w-full h-full">
            <div className="col-span-2">
                <Breadcrumbs
                    connectionId={connectionId}
                    currentDatabase={currentDatabase}
                    currentTable={currentTable}
                    {...rest}
                />
            </div>
            {rows && columns && (
                <div className="col-span-2 overflow-hidden">
                    <div className="w-full h-full overflow-auto">
                        <Table key={currentTable} columns={columns} rows={rows} onPersist={handleChangePersist} />
                    </div>
                </div>
            )}
        </div>
    );

    async function handleChangePersist(changes: Change[]) {
        console.debug('[Table] Persisting changes', changes);
    }
}
