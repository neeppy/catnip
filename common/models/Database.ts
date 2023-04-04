export interface DatabaseMetadata {
    databases: string[];
    tables: string[];
}

export type DatabaseRow = Record<string, unknown>;

export interface DatabaseColumn {
    name: string;
    type: string;
    defaultValue: unknown;
    isNullable: boolean;
    isPrimaryKey: boolean;
    comment: string;
}

export interface DatabaseTable {
    name: string;
    rowsCount: number;
    size: number;
    comment: string;
}

export interface TableInitialisationData {
    rows: DatabaseRow[];
    columns: unknown[];
}
