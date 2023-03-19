import { useQuery } from '@tanstack/react-query';
import { TableInitialisationData } from 'common/models/Database';
import { Spreadsheet } from 'ui-kit';
import FloatingEditor from 'ui/components/screen/FloatingEditor';
import { getTableRows } from '../queries';
import { TableView } from '../state';
import Breadcrumbs from './Breadcrumbs';

export function TableViewTab({ connectionId, currentTable, ...rest }: TableView) {
    const { data } = useQuery<TableInitialisationData>(['rows', currentTable], () => getTableRows(connectionId, currentTable));

    const currentRows = data?.rows ?? [];

    return (
        <div className="text-scene-default grid grid-cols-table grid-rows-table h-full">
            <FloatingEditor className="w-96 h-20" />
            <div className="col-span-2">
                <Breadcrumbs connectionId={connectionId} currentTable={currentTable} {...rest} />
            </div>
            {currentRows && currentRows.length > 0 && (
                <div className="col-span-2 p-4 rounded-tl-lg overflow-hidden">
                    <div className="w-full h-full overflow-auto">
                        <Spreadsheet key={currentTable} rows={currentRows}/>
                    </div>
                </div>
            )}
        </div>
    );
}
