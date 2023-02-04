import mysql from 'mysql2/promise';
import { Connection } from 'common/models/Connection';
import { safeStorage } from 'electron';

export default async function createMySQLAdapter(parameters: Connection) {
    const password = safeStorage.decryptString(Buffer.from(parameters.password, 'base64'));

    const connection = await mysql.createConnection({
        host: parameters.hostname,
        port: parameters.port ?? 3306,
        user: parameters.username,
        password,
        database: parameters.databaseName,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    return {
        async query<T>(sql: string, asArray: boolean = false): Promise<T> {
            const [rows] = await connection.query({ sql, rowsAsArray: asArray });

            return rows as T;
        }
    };
}
