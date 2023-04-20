export type DatabaseRow = Record<string, unknown>;

export interface QueryField {
    name: string;
    type: string;
}

export interface DatabaseColumn extends QueryField {
    defaultValue: unknown;
    isNullable: boolean;
    isPrimaryKey: boolean;
    comment?: string;
}

export interface DatabaseTable {
    name: string;
    comment?: string;
}

export interface QueryResult {
    columns: QueryField[];
    rows: DatabaseRow[];
}
