import { ConnectionRegistry } from '../../process/connections';
import { Route } from '../types';
import { DatabaseRow } from 'common/models/Database';

export default [
    {
        channel: '@@db/tables',
        async handle(args, connectionId: string, dbName: string): Promise<string[]> {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/tables" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);
            const tables = await connection.getTableNames(dbName);

            return tables.map(table => table.name);
        }
    },
    {
        channel: '@@db/table-columns',
        async handle(args, connectionId: string, database: string, table: string) {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/table-columns" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);

            return connection.getTableColumns(database, table);
        },
    },
    {
        channel: '@@db/table-initial',
        async handle(args, connectionId: string, database: string, table: string) {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/table-initial" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);

            return connection.query<DatabaseRow>(`SELECT * FROM \`${database}\`.\`${table}\` LIMIT ?`, {
                preparedValues: [100],
            });
        }
    },
    {
        channel: '@@db/user-query',
        async handle(args, connectionId: string, database: string, query: string) {
            if (!ConnectionRegistry.has(connectionId)) {
                throw new Error('Invalid request "@@db/user-query" for connection ID: ' + connectionId);
            }

            const connection = ConnectionRegistry.get(connectionId);

            return connection.runUserQuery(database, query);
        }
    },
] as Route[];
