import mysql from 'mysql2/promise';
import { Connection } from 'common/models/Connection';
import { safeStorage } from 'electron';
import { QueryOptions } from './createConnection';

export default async function createMySQLAdapter(parameters: Connection) {
    const password = safeStorage.decryptString(Buffer.from(parameters.password, 'base64'));

    const connection = await mysql.createConnection({
        host: parameters.hostname,
        port: parameters.port ?? 3306,
        user: parameters.username,
        password,
        // database: parameters.databaseName,
        ssl: {
            rejectUnauthorized: false
        }
    });

    return {
        async use(dbName: string) {
            await connection.query(`USE \`${dbName}\``);
        },

        async query<T>(sql: string, options: QueryOptions): Promise<T> {
            const [rows] = await connection.query({ sql, rowsAsArray: options.asArray ?? false }, options.preparedValues);

            return rows as T;
        }
    };
}
