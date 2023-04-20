import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { DatabaseColumn, DatabaseTable, QueryResult } from 'common/models/Database';
import { createMySQLAdapter } from './mysql';
import { createSQLiteAdapter } from './sqlite';

export interface QueryOptions {
    asArray?: boolean;
    preparedValues?: any[];
}

export type AdapterFactory = (connection: AnyConnection, ...params: any) => Promise<ConnectionLike>;

export interface ConnectionLike {
    driver: ConnectionDriver
    getTableNames: (dbName: string) => Promise<DatabaseTable[]>;
    getTableColumns: (dbName: string, tableName: string) => Promise<DatabaseColumn[]>;
    getDatabases: () => Promise<string[]>;
    query: <T>(query: string, options?: QueryOptions) => Promise<T[]>;
    runUserQuery: (database: string, query: string) => Promise<QueryResult>;
}

const connectionDriverFactories: Record<ConnectionDriver, AdapterFactory> = {
    [ConnectionDriver.MySQL]: createMySQLAdapter,
    [ConnectionDriver.SQLite]: createSQLiteAdapter,
};

export default async function createConnection(connection: AnyConnection): Promise<ConnectionLike> {
    const factory = connectionDriverFactories[connection.driver];

    return factory(connection);
}
