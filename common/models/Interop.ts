import { Connection } from './Connection';
import { DatabaseMetadata, TableInitialisationData } from './Database';

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
        open: (conn: Connection) => Promise<DatabaseMetadata>;
    };
    database: {
        fetchTableNames: (connectionId: string, database: string) => Promise<string[]>;
        fetchTableContent: (connectionId: string, table: string) => Promise<TableInitialisationData>;
    };
}
