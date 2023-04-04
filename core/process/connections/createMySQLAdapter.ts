import mysql from 'mysql2/promise';
import { Connection } from 'common/models/Connection';
import { safeStorage } from 'electron';
import { QueryOptions } from './createConnection';
import { DatabaseColumn, DatabaseTable } from 'common/models/Database';

interface ColumnRow {
    COLUMN_NAME: string;
    DATA_TYPE: string;
    COLUMN_DEFAULT: unknown;
    IS_NULLABLE: string;
    COLUMN_COMMENT: string;
    COLUMN_KEY: string;
}

interface TableRow {
    TABLE_NAME: string;
    TABLE_ROWS: number;
    DATA_LENGTH: number;
    TABLE_COMMENT: string;
}

export default async function createMySQLAdapter(parameters: Connection, tunnel: ReadableStream) {
    const password = parameters.password ? safeStorage.decryptString(Buffer.from(parameters.password, 'base64')) : '';

    const connection = await mysql.createConnection({
        host: parameters.hostname ?? '',
        port: parameters.port ?? 3306,
        user: parameters.username ?? '',
        password,
        stream: tunnel,
        // database: parameters.databaseName,
        // ssl: {
        //     rejectUnauthorized: false
        // }
    });

    return {
        async getTableColumns(dbName: string, tableName: string): Promise<DatabaseColumn[]> {
            const [rows] = await connection.query(
                `SELECT * FROM information_schema.columns WHERE table_schema = ? AND table_name = ?`,
                [dbName, tableName]
            );

            return (rows as ColumnRow[]).map(column => ({
                name: column.COLUMN_NAME,
                type: column.DATA_TYPE,
                defaultValue: column.COLUMN_DEFAULT,
                isNullable: column.IS_NULLABLE === 'YES',
                isPrimaryKey: column.COLUMN_KEY === 'PRI',
                comment: column.COLUMN_COMMENT ?? '',
            }));
        },

        async getTableNames(dbName: string): Promise<DatabaseTable[]> {
            const [rows] = await connection.query(
                `SELECT * FROM information_schema.tables WHERE table_schema = ?`,
                [dbName]
            );

            return (rows as TableRow[]).map(table => ({
                name: table.TABLE_NAME,
                rowsCount: table.TABLE_ROWS,
                size: table.DATA_LENGTH,
                comment: table.TABLE_COMMENT ?? ''
            }));
        },

        async query<T>(sql: string, options: QueryOptions): Promise<T[]> {
            const [rows] = await connection.query({ sql, rowsAsArray: options.asArray ?? false }, options.preparedValues);

            return rows as T[];
        }
    };
}
