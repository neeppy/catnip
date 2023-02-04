import { Connection, ConnectionDriver } from 'common/models/Connection';
import createMySQLAdapter from './createMySQLAdapter';

interface ConnectionLike {
    query: <T>(query: string, asArray: boolean) => Promise<T>;
}

const connectionDriverFactories = {
    [ConnectionDriver.MySQL]: createMySQLAdapter,
};

export default async function createConnection(connection: Connection): Promise<ConnectionLike> {
    const factory = connectionDriverFactories[connection.driver];

    return factory(connection);
}
