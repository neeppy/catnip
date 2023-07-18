import SQLiteDatabase from 'better-sqlite3';
import { SQLiteConnection } from 'common/models/Connection';
import { AdapterFactory, QueryOptions } from '../createConnection';
import { DatabaseColumn, DatabaseRow } from '../../../../common/models/Database';
import { getColumnType } from '../getColumnType';

interface SQLiteRowWithName {
    name: string;
}

interface SQLiteColumn {
    cid: number;
    name: string;
    type: string;
    notnull: 0 | 1;
    dflt_value: any;
    pk: 0 | 1;
}

export const createSQLiteAdapter: AdapterFactory = async(parameters: SQLiteConnection) => {
    const db = new SQLiteDatabase(parameters.path);

    return {
        driver: parameters.driver,

        getTableColumns(dbName: string, tableName: string) {
            return new Promise(resolve => {
                const rawColumns = db.pragma(`table_info(${tableName})`) as SQLiteColumn[];

                const columns: DatabaseColumn[] = rawColumns.map(row => ({
                    name: row.name,
                    type: getColumnType(parameters.driver, row.type),
                    defaultValue: row.dflt_value,
                    isNullable: row.notnull === 1,
                    isPrimaryKey: row.pk === 1,
                }));

                return resolve(columns);
            });
        },

        getTableNames() {
            return new Promise(resolve => {
                const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=?')
                    .all(['table']) as SQLiteRowWithName[];

                resolve(tables);
            });
        },

        async getDatabases() {
            return new Promise(resolve => {
                const result = db.pragma('database_list') as SQLiteRowWithName[];
                const databases = result.map(row => row.name);

                resolve(databases);
            });
        },

        query<T>(query: string, options: QueryOptions = {}): Promise<T[]> {
            return new Promise(resolve => {
                const results = db.prepare(query).all(...options.preparedValues || []);

                resolve(results as T[]);
            });
        },

        runUserQuery(database: string, query: string) {
            return new Promise(resolve => {
                const results = db.prepare(query);

                const columnMetadata = results.columns();
                const rows = results.all();

                const fields: DatabaseColumn[] = columnMetadata.map(field => ({
                    name: field.name,
                    type: getColumnType(parameters.driver, field.type || 'NVARCHAR'),
                    isNullable: true,
                    isPrimaryKey: false,
                    defaultValue: null,
                }));

                resolve({
                    columns: fields,
                    rows: rows as DatabaseRow[],
                });
            });
        },
    };
};
