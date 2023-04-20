import { getTableColumns, getTableRows, TableView } from 'ui/components/tabs';
import { useQuery } from '@tanstack/react-query';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import FloatingEditor from 'ui/components/screen/FloatingEditor';
import Spreadsheet from 'ui-kit/spreadsheet';
import SingleDatabaseBreadcrumbs from './SingleDatabaseBreadcrumbs';

export function SingleDatabaseTableView({ connectionId, currentDatabase, currentTable, ...rest }: TableView) {
    const { data: columns } = useQuery<DatabaseColumn[]>({
        queryKey: ['columns', currentDatabase, currentTable],
        queryFn: () => getTableColumns(connectionId, '', currentTable as string),
        enabled: !!currentTable,
    });

    const { data: rows } = useQuery<DatabaseRow[]>({
        queryKey: ['rows', currentDatabase, currentTable],
        queryFn: () => getTableRows(connectionId, '', currentTable as string),
        enabled: !!currentTable,
    });

    return (
        <div className="text-scene-default grid grid-cols-table grid-rows-table h-full">
            {currentDatabase && (
                <FloatingEditor className="w-96 h-20"/>
            )}
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
                        <Spreadsheet rows={rows} columns={columns} />
                    </div>
                </div>
            )}
        </div>
    );
}
