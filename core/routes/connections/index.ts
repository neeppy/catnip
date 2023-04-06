import { Connection } from 'common/models/Connection';
import { createSSHTunnel } from 'core/process/ssh';
import { ConnectionRegistry, createConnection } from 'core/process/connections';
import { Route } from '../types';

export default [
    {
        channel: '@@connection/init',
        async handle(args, connection: Connection) {
            if (ConnectionRegistry.has(connection.id)) {
                console.debug('Connection already live - using the old one!');
            }

            let sshTunnel = null;

            if (connection.sshTunnelConfiguration?.hostname) {
                console.debug('SSH Configuration detected... Creating SSH tunnel.');
                sshTunnel = await createSSHTunnel(connection.hostname, connection.port, connection.sshTunnelConfiguration);
                console.debug('Successfully created SSH tunnel.');
            }

            console.debug('Attempting database connection.');
            const databaseConnection = await createConnection(connection, sshTunnel);

            if (!ConnectionRegistry.has(connection.id)) {
                ConnectionRegistry.set(connection.id, databaseConnection);
                console.debug(`Connection successful. Added "${connection.name}" (${connection.id}) to registry.`);
            }
        }
    },
    {
        channel: '@@connection/databases',
        async handle(args, connectionId: string): Promise<string[]> {
            if (!ConnectionRegistry.has(connectionId)) {
                console.debug(`Connection "${connectionId}" was not initialised.`);
                return;
            }

            const connection = ConnectionRegistry.get(connectionId);

            const databasesRows = await connection.query<string[]>('SHOW DATABASES', { asArray: true });
            return databasesRows.map(row => row[0]);
        }
    },
] as Route[];
