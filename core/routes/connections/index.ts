import { Connection } from 'common/models/Connection';
import { createSSHTunnel } from 'core/process/ssh';
import { createConnection } from 'core/process/connections';

const ConnectionRegistry = new Map();

export default [
    {
        channel: '@@connection/init',
        async handle(connection: Connection) {
            if (connection.sshTunnelConfiguration.hostname) {
                console.debug('SSH Configuration detected... Creating SSH tunnel.');
                await createSSHTunnel(connection.sshTunnelConfiguration);
                console.debug('Successfully created SSH tunnel.');
            }

            console.debug('Attempting database connection.');
            const databaseConnection = await createConnection(connection);

            if (!ConnectionRegistry.has(connection.name)) {
                ConnectionRegistry.set(connection.name, databaseConnection);
                console.debug('Success. Entry', connection.name, 'was added to the connection registry.');
            }

            const rows = await databaseConnection.query<string[][]>('SHOW TABLES', true);
            const tables = rows.map(row => row[0]);

            return tables;
        }
    }
];
