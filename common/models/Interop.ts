import { AnyConnection } from './Connection';
import { DatabaseColumn, DatabaseRow, QueryResult } from './Database';
import { SettingChange, Settings } from './Settings';

export interface Interop {
    platform: 'win32' | 'darwin';
    isWindows: boolean;
    isMacOS:  boolean;
    isLinux: boolean;
    settings: {
        fetch: () => Promise<Settings>;
        update: <T extends Leaves<Settings>>(updates: SettingChange<T>[]) => Promise<void>;
    };
    control: {
        close: () => unknown;
        minimize: () => unknown;
        maximize: () => unknown;
        fileSystemSearch: () => Promise<string | null>;
    };
    data: {
        encrypt: (data: string) => Promise<string>;
    },
    connections: {
        open: (conn: AnyConnection) => unknown;
        listDatabases: (connectionId: string) => Promise<string[]>;
    };
    database: {
        fetchTableNames: (connectionId: string, database: string) => Promise<string[]>;
        fetchTableColumns: (connectionId: string, database: string, table: string) => Promise<DatabaseColumn[]>;
        fetchTableContent: (connectionId: string, database: string | null, table: string) => Promise<DatabaseRow[]>;
        runUserQuery: (connectionId: string, database: string, query: string) => Promise<QueryResult>;
    };
}
