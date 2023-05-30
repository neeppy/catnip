import mysql from 'mysql2/promise';
import { safeStorage } from 'electron';
import { MySQLConnection } from 'common/models/Connection';
import { DatabaseColumn, DatabaseRow, DatabaseTable, QueryField, QueryResult } from 'common/models/Database';
import { AdapterFactory, QueryOptions } from '../createConnection';
import { COLUMN_TYPES } from './types';
import { createSSHTunnel } from '../../ssh';

interface ColumnRow {
    CHARACTER_MAXIMUM_LENGTH: number;
    COLUMN_COMMENT: string;
    COLUMN_DEFAULT: unknown;
    COLUMN_KEY: string;
    COLUMN_NAME: string;
    COLUMN_TYPE: string;
    DATA_TYPE: string;
    IS_NULLABLE: string;
}

interface TableRow {
    DATA_LENGTH: number;
    TABLE_COMMENT: string;
    TABLE_NAME: string;
    TABLE_ROWS: number;
}

function getEnumOptions(columnType: string) {
    const enumRegex = /enum\((.+)\)/;
    const [, match] = columnType.match(enumRegex);

    return eval(`[${match}]`);
}

export const createMySQLAdapter: AdapterFactory = async (parameters: MySQLConnection) => {
    const password = parameters.password ? safeStorage.decryptString(Buffer.from(parameters.password, 'base64')) : '';

    let sshTunnel = null;

    if (parameters.sshTunnelConfiguration.hostname) {
        console.debug('[MySQL] SSH Configuration detected... Creating SSH tunnel.');
        sshTunnel = await createSSHTunnel(parameters.hostname, parameters.port, parameters.sshTunnelConfiguration);
        console.debug('[MySQL] Successfully created SSH tunnel.');
    }

    const connection = await mysql.createConnection({
        host: parameters.hostname ?? '',
        port: parameters.port ?? 3306,
        user: parameters.username ?? '',
        password,
        stream: sshTunnel,
        database: parameters.databaseName
    });

    return {
        driver: parameters.driver,

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
                restrictions: {
                    length: column.CHARACTER_MAXIMUM_LENGTH,
                    options: column.DATA_TYPE === 'enum' ? getEnumOptions(column.COLUMN_TYPE) : [],
                }
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

        async getDatabases() {
            const [databasesRows] = await connection.query({
                sql: 'SHOW DATABASES',
                rowsAsArray: true
            }) as unknown as string[][];

            return databasesRows.map(row => row[0]);
        },

        async query<T>(sql: string, options: QueryOptions = {}): Promise<T[]> {
            options = options ?? {};

            const [rows] = await connection.query({ sql, rowsAsArray: options.asArray ?? false }, options.preparedValues ?? []);

            return rows as T[];
        },

        async runUserQuery(database: string, query: string): Promise<QueryResult> {
            await connection.query(`USE ${database}`);

            const [result, fields] = await connection.query(query);

            const responseFields: QueryField[] = fields.map(field => ({
                name: field.name,
                type: COLUMN_TYPES[field.type]
            }));

            return {
                columns: responseFields,
                rows: result as DatabaseRow[],
            };
        }
    };
};
