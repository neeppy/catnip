import { ConnectionConfig, ConnectionDriver, MySQLConnection, SQLiteConnection } from 'common/models/Connection';

type MappingFunction<T> = (submittedConnection: T, existingConnection?: T) => Promise<T>;
export type GenericMappingFunction = MappingFunction<ConnectionConfig[ConnectionDriver]>;

type ConnectionDriverMapping = {
    [K in keyof ConnectionConfig]: MappingFunction<ConnectionConfig[K]>;
}

export const connectionDriverMappings: ConnectionDriverMapping = {
    [ConnectionDriver.MySQL]: mysqlConnectionMappings,
    [ConnectionDriver.SQLite]: sqliteConnectionMappings,
};

async function mysqlConnectionMappings(submittedConnection: MySQLConnection, existingConnection?: MySQLConnection): Promise<MySQLConnection> {
    const passwordUpdatePromises = [];

    if (existingConnection?.password !== submittedConnection.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(submittedConnection.password)
                .then(hashed => (submittedConnection.password = hashed))
        );
    }

    if (existingConnection?.sshTunnelConfiguration.password !== submittedConnection.sshTunnelConfiguration.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(submittedConnection.sshTunnelConfiguration.password)
                .then(hashed => (submittedConnection.sshTunnelConfiguration.password = hashed))
        );
    }

    if (existingConnection?.sshTunnelConfiguration.jumpConfiguration.password !== submittedConnection.sshTunnelConfiguration.jumpConfiguration.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(submittedConnection.sshTunnelConfiguration.jumpConfiguration.password)
                .then(hashed => (submittedConnection.sshTunnelConfiguration.jumpConfiguration.password = hashed))
        );
    }

    return submittedConnection;
}

async function sqliteConnectionMappings(submittedConnection: SQLiteConnection, existingConnection?: SQLiteConnection): Promise<SQLiteConnection> {
    return submittedConnection;
}
