import { Connection, ConnectionDriver } from 'common/models/Connection';
import createMySQLAdapter from './createMySQLAdapter';
import { DatabaseColumn, DatabaseTable, QueryResult } from 'common/models/Database';

export interface QueryOptions {
    asArray?: boolean;
    preparedValues?: any[];
}

export interface ConnectionLike {
    getTableNames: (dbName: string) => Promise<DatabaseTable[]>;
    getTableColumns: (dbName: string, tableName: string) => Promise<DatabaseColumn[]>;
    query: <T>(query: string, options?: QueryOptions) => Promise<T[]>;
    runUserQuery: (database: string, query: string) => Promise<QueryResult>;
}

const connectionDriverFactories = {
    [ConnectionDriver.MySQL]: createMySQLAdapter,
};

export default async function createConnection(connection: Connection, tunnel?: ReadableStream): Promise<ConnectionLike> {
    const factory = connectionDriverFactories[connection.driver];

    return factory(connection, tunnel);
}
