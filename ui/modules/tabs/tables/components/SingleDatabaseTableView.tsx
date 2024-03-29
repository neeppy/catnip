import { useQuery } from '@tanstack/react-query';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import { TableView } from '$module:tabs';
import { getTableColumns, getTableRows } from '../queries';
import SingleDatabaseBreadcrumbs from './SingleDatabaseBreadcrumbs';
import { Change } from '$components';
import { Table } from '$components/table';

export function SingleDatabaseTableView({ connectionId, currentDatabase, currentTable, ...rest }: TableView) {
    const { data: columns } = useQuery<DatabaseColumn[]>({
        queryKey: ['columns', currentDatabase, currentTable],
        queryFn: () => getTableColumns(connectionId, '', currentTable as string),
        enabled: !!currentTable
    });

    const { data: rows } = useQuery<DatabaseRow[]>({
        queryKey: ['rows', currentDatabase, currentTable],
        queryFn: () => getTableRows(connectionId, '', currentTable as string),
        enabled: !!currentTable
    });

    return (
        <div className="text-foreground-default grid grid-cols-table grid-rows-table w-full h-full">
            <div className="col-span-2">
                <SingleDatabaseBreadcrumbs
                    connectionId={connectionId}
                    currentDatabase={currentDatabase}
                    currentTable={currentTable}
                    {...rest}
                />
            </div>
            {rows && columns && (
                <div className="col-span-2 overflow-hidden">
                    <div className="w-full h-full overflow-auto">
                        <Table key={currentTable} columns={columns} rows={rows} onPersist={doPersist} />
                    </div>
                </div>
            )}
        </div>
    );

    function doPersist(changes: Change[]) {
        console.log('persisting', changes);
    }
}
