import { AnyConnection } from 'common/models/Connection';
import { ConnectionRegistry, createConnection } from 'core/process/connections';
import { Route } from '../types';

export default [
    {
        channel: '@@connection/init',
        async handle(args, connection: AnyConnection) {
            if (ConnectionRegistry.has(connection.id)) {
                console.debug('Connection already live - using the old one!');
            }

            console.debug('Attempting database connection.');
            const databaseConnection = await createConnection(connection);

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

            return connection.getDatabases();
        }
    },
] as Route[];
