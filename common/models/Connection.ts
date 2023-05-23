export enum ConnectionDriver {
    MySQL = 'mysql',
    SQLite = 'sqlite',
}

export interface SSHConnection {
    hostname: string;
    port: number;
    username: string;
    password: string;
}

export interface TunnelConfiguration extends SSHConnection {
    jumpConfiguration: SSHConnection;
}

export interface Connection<TDriver extends ConnectionDriver> {
    id: string;
    name: string;
    driver: TDriver;
    groupId?: string;
}

export interface MySQLConnection extends Connection<ConnectionDriver.MySQL> {
    hostname: string;
    port: number;
    username: string;
    password: string;
    databaseName?: string;
    sshTunnelConfiguration: TunnelConfiguration;
}

export interface SQLiteConnection extends Connection<ConnectionDriver.SQLite> {
    path: string;
}

export type ConnectionConfig = {
    [ConnectionDriver.MySQL]: MySQLConnection;
    [ConnectionDriver.SQLite]: SQLiteConnection;
}

export type AllConnections = MySQLConnection & SQLiteConnection;
export type AnyConnection = ConnectionConfig[keyof ConnectionConfig];
