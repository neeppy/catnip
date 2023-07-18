export enum ColumnType {
    String = 'string',
    Text = 'text',
    Number = 'number',
    Date = 'date',
    DateTime = 'datetime',
    Enum = 'enum',
    Boolean = 'bool',
}

export type DatabaseRow = Record<string, unknown>;

export interface QueryField {
    name: string;
    type: ColumnType;
}

export interface ColumnDetails {
    options: unknown[];
}

export interface DatabaseColumn extends QueryField {
    defaultValue: unknown;
    isNullable: boolean;
    isPrimaryKey: boolean;
    comment?: string;
    details?: Partial<ColumnDetails>;
}

export interface DatabaseTable {
    name: string;
    comment?: string;
}

export interface QueryResult {
    columns: DatabaseColumn[];
    rows: DatabaseRow[];
}
