export type DatabaseRow = Record<string, unknown>;

export interface QueryField {
    name: string;
    type: string;
}

export interface ColumnRestrictions {
    length: number;
    options: unknown[];
}

export interface DatabaseColumn extends QueryField {
    defaultValue: unknown;
    isNullable: boolean;
    isPrimaryKey: boolean;
    comment?: string;
    restrictions: ColumnRestrictions;
}

export interface DatabaseTable {
    name: string;
    comment?: string;
}

export interface QueryResult {
    columns: QueryField[];
    rows: DatabaseRow[];
}
