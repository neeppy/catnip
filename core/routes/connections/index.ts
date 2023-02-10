import { Connection } from 'common/models/Connection';
import { createSSHTunnel } from 'core/process/ssh';
import { ConnectionRegistry, createConnection } from 'core/process/connections';
import { DatabaseMetadata } from 'common/models/Database';
import { Route } from '../types';

export default [
    {
        channel: '@@connection/init',
        async handle(args, connection: Connection): Promise<DatabaseMetadata> {
            if (connection.sshTunnelConfiguration?.hostname) {
                console.debug('SSH Configuration detected... Creating SSH tunnel.');
                await createSSHTunnel(connection.sshTunnelConfiguration);
                console.debug('Successfully created SSH tunnel.');
            }

            console.debug('Attempting database connection.');
            const databaseConnection = await createConnection(connection);

            if (!ConnectionRegistry.has(connection.id)) {
                ConnectionRegistry.set(connection.id, databaseConnection);
                console.debug(`Connection successful. Added "${connection.name}" (${connection.id}) to registry.`);
            }

            const databasesRows = await databaseConnection.query<string[][]>('SHOW DATABASES', { asArray: true });
            const databaseNames = databasesRows.map(row => row[0]);

            const isDatabaseUsed = databaseNames.includes(connection.databaseName);
            let tableNames = [];

            if (isDatabaseUsed) {
                const tablesRows = await databaseConnection.query<string[][]>('SHOW TABLES', { asArray: true });
                tableNames = tablesRows.map(row => row[0]);
            }

            return {
                databases: databaseNames,
                tables: tableNames,
            };
        }
    }
] as Route[];
