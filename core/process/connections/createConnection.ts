import { Connection, ConnectionDriver } from 'common/models/Connection';
import createMySQLAdapter from './createMySQLAdapter';
import { DatabaseColumn, DatabaseTable } from 'common/models/Database';

export interface QueryOptions {
    asArray?: boolean;
    preparedValues?: any[];
}

export interface ConnectionLike {
    query: <T>(query: string, options: QueryOptions) => Promise<T[]>;
    getTableNames: (dbName: string) => Promise<DatabaseTable[]>;
    getTableColumns: (dbName: string, tableName: string) => Promise<DatabaseColumn[]>;
}

const connectionDriverFactories = {
    [ConnectionDriver.MySQL]: createMySQLAdapter,
};

export default async function createConnection(connection: Connection, tunnel?: ReadableStream): Promise<ConnectionLike> {
    const factory = connectionDriverFactories[connection.driver];

    return factory(connection, tunnel);
}
