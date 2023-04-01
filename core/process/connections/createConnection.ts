import { Connection, ConnectionDriver } from 'common/models/Connection';
import createMySQLAdapter from './createMySQLAdapter';

export interface QueryOptions {
    asArray?: boolean;
    preparedValues?: any[];
}

export interface ConnectionLike {
    use: (dbName: string) => Promise<void>;
    query: <T>(query: string, options: QueryOptions) => Promise<T>;
}

const connectionDriverFactories = {
    [ConnectionDriver.MySQL]: createMySQLAdapter,
};

export default async function createConnection(connection: Connection, tunnel?: ReadableStream): Promise<ConnectionLike> {
    const factory = connectionDriverFactories[connection.driver];

    return factory(connection, tunnel);
}
