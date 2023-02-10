import shallow from 'zustand/shallow';
import useMainPanel from 'ui/state/panel';
import Breadcrumbs from './Breadcrumbs';
import { Spreadsheet } from 'ui-kit';

export default function MainScreen() {
    const [currentRows, currentTable] = useMainPanel(state => [state.currentRows, state.currentTable], shallow);

    return (
        <div className="text-scene-default grid grid-cols-table grid-rows-table h-full">
            <div className="col-span-2">
                <Breadcrumbs />
            </div>
            {currentRows && currentRows.length > 0 && (
                <div className="col-span-2 p-4 rounded-tl-lg overflow-hidden">
                    <div className="w-full h-full overflow-auto">
                        <Spreadsheet key={currentTable + '-spreadsheet'} rows={currentRows}/>
                    </div>
                </div>
            )}
        </div>
    );
}
