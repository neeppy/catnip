import { useQuery } from '@tanstack/react-query';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import Spreadsheet from '$components/spreadsheet';
import { TableView } from '$module:tabs';
import { getTableColumns, getTableRows } from '../queries';
import SingleDatabaseBreadcrumbs from './SingleDatabaseBreadcrumbs';

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
        <div className="text-scene-default grid grid-cols-table grid-rows-table h-full">
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
                        <Spreadsheet rows={rows} columns={columns}/>
                    </div>
                </div>
            )}
        </div>
    );
}