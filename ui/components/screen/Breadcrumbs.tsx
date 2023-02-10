import { useAtom } from 'jotai';
import shallow from 'zustand/shallow';
import { Dropdown } from 'ui-kit';
import { appModeState } from 'ui/state/global';
import useMainPanel from 'ui/state/panel';
import { FaChevronRight } from 'react-icons/fa';

const advancedDbNames = [
    'information_schema',
    'mysql',
    'performance_schema',
    'sys'
];

export default function Breadcrumbs() {
    const [isAdvanced] = useAtom(appModeState);
    const connection = useMainPanel(state => ({
        isConnected: state.isConnected,
        databaseNames: state.databaseNames,
        tableNames: state.tableNames,
        name: state.connection?.name,
        id: state.connection?.id,
        currentDatabase: state.currentDatabase,
        updateConnectionData: state.updateConnectionData,
    }), shallow);

    if (!connection.isConnected) {
        return null;
    }

    const databaseOptions = connection.databaseNames
        .filter(dbName => isAdvanced || !advancedDbNames.includes(dbName))
        .map(dbName => ({
            label: dbName,
            value: dbName,
        }));

    const tableOptions = connection.tableNames?.map(table => ({
        label: table,
        value: table,
    }));

    async function onDatabaseChange(database: string) {
        if (database !== connection.currentDatabase) {
            const tableNames = await window.interop.database.fetchTableNames(connection.id ?? '', database);

            connection.updateConnectionData({
                tableNames,
                currentDatabase: database,
                currentTable: null,
                currentRows: [],
            });
        }
    }

    async function onTableChange(table: string) {
        const { rows, columns } = await window.interop.database.fetchTableContent(connection.id ?? '', table);

        connection.updateConnectionData({
            currentTable: table,
            currentRows: rows,
        });
    }

    return (
        <div className="inline-flex items-center gap-2 bg-accent-700 p-2 rounded-br-2xl shadow-lg">
            <div className="px-4">
                {connection.name}
            </div>
            <FaChevronRight/>
            <Dropdown placeholder="Choose a database" options={databaseOptions} onChange={onDatabaseChange} />
            <FaChevronRight/>
            <Dropdown placeholder="Choose a table" options={tableOptions ?? []} onChange={onTableChange} />
        </div>
    );
}
