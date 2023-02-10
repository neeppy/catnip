export interface DatabaseMetadata {
    databases: string[];
    tables: string[];
}

export type DatabaseRow = Record<string, unknown>;

export interface TableInitialisationData {
    rows: DatabaseRow[];
    columns: unknown[];
}
