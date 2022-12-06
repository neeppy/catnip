import IndexedDB from './IndexedDB';

enum ConnectionType {
    SSH = 'ssh',
    TCP = 'tcp/ip',
}

enum ConnectionDriver {
    MySQL = 'mysql',
    PostgreSQL = 'postgresql',
    MongoDB = 'mongodb',
    SQLite = 'sqlite',
}

export interface Connection {
    id: string;
    type: ConnectionType;
    driver: ConnectionDriver;
    displayName: string;
}

export async function fetchConnections() {
    const idb = await IndexedDB.getInstance();

    return idb.get<Connection>('connections');
}
