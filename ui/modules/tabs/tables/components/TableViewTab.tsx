import { useQuery } from '@tanstack/react-query';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import Spreadsheet from '$components/spreadsheet';
import { isMultiDatabaseConnection, useConnections } from '$module:connections';
import { TableView } from '$module:tabs';
import { getTableColumns, getTableRows } from '../queries';
import Breadcrumbs from './Breadcrumbs';

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
                        <Spreadsheet rows={rows} columns={columns}/>
                    </div>
                </div>
            )}
        </div>
    );
}
