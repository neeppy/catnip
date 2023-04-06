import { Connection } from './Connection';
import { DatabaseColumn, DatabaseRow, QueryResult } from './Database';

export interface Interop {
    platform: string;
    control: {
        close: () => unknown;
        minimize: () => unknown;
        maximize: () => unknown;
    };
    data: {
        encrypt: (data: string) => Promise<string>;
    },
    dialog: {
        file: () => unknown;
    };
    connections: {
        open: (conn: Connection) => unknown;
        listDatabases: (connectionId: string) => Promise<string[]>;
    };
    database: {
        fetchTableNames: (connectionId: string, database: string) => Promise<string[]>;
        fetchTableColumns: (connectionId: string, database: string, table: string) => Promise<DatabaseColumn[]>;
        fetchTableContent: (connectionId: string, database: string, table: string) => Promise<DatabaseRow[]>;
        runUserQuery: (connectionId: string, database: string, query: string) => Promise<QueryResult>;
    };
}
