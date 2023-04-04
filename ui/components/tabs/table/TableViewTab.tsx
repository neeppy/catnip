import { useQuery } from '@tanstack/react-query';
import FloatingEditor from 'ui/components/screen/FloatingEditor';
import { getTableColumns, getTableRows } from '../queries';
import { TableView } from '../state';
import Breadcrumbs from './Breadcrumbs';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import Spreadsheet from 'ui-kit/spreadsheet';

export function TableViewTab({ connectionId, currentDatabase, currentTable, ...rest }: TableView) {
    const { data: columns } = useQuery<DatabaseColumn[]>({
        queryKey: ['columns', currentDatabase, currentTable],
        queryFn: () => getTableColumns(connectionId, currentDatabase as string, currentTable as string),
        enabled: Boolean(currentDatabase && currentTable)
    });

    const { data: rows } = useQuery<DatabaseRow[]>({
        queryKey: ['rows', currentDatabase, currentTable],
        queryFn: () => getTableRows(connectionId, currentDatabase as string, currentTable as string),
        enabled: Boolean(currentDatabase && currentTable)
    });

    return (
        <div className="text-scene-default grid grid-cols-table grid-rows-table h-full">
            <FloatingEditor className="w-96 h-20"/>
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
                        <Spreadsheet rows={rows} columns={columns} />
                    </div>
                </div>
            )}
        </div>
    );
}
