import { ConnectionRegistry } from '../../process/connections';
import { Route } from '../types';
import { DatabaseRow, TableInitialisationData } from 'common/models/Database';

export default [
    {
        channel: '@@db/tables',
        async handle(args, connectionId: string, dbName: string): Promise<string[]> {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/tables" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);

            await connection.use(dbName);

            const tablesRows = await connection.query<string[][]>('SHOW TABLES', { asArray: true });

            return tablesRows.map(row => row[0]);
        }
    },
    {
        channel: '@@db/table-initial',
        async handle(args, connectionId: string, table: string): Promise<TableInitialisationData> {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/table-initial" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);

            const initialData = await connection.query<DatabaseRow[]>(`SELECT * FROM \`${table}\` LIMIT ?`, {
                preparedValues: [100],
            });

            const tableColumnRows = await connection.query<string[][]>(`SHOW COLUMNS FROM \`${table}\``, {
                asArray: true
            });

            const tableColumns = tableColumnRows.map(column => column[0]);

            return {
                rows: initialData,
                columns: tableColumns
            };
        }
    },
] as Route[];
