import { AnyConnection, ConnectionDriver } from 'common/models/Connection';

const UNIQUE_DATABASE_DRIVERS = [
    ConnectionDriver.SQLite
];

export function isMultiDatabaseConnection(connection: AnyConnection): boolean {
    return !UNIQUE_DATABASE_DRIVERS.includes(connection.driver);
}
