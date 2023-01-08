import IndexedDB from 'ui/utils/IndexedDB';
import { Connection } from 'common/models/Connection';

export async function fetchConnections() {
    const idb = await IndexedDB.getInstance();

    return idb.get<Connection>('connections');
}

export async function insertConnection(connection: Connection) {
    const idb = await IndexedDB.getInstance();

    const [passwordHash, sshPasswordHash, sshJumpPasswordHash] = await Promise.all([
        interop.data.encrypt(connection.password),
        connection.sshTunnelConfiguration?.password && interop.data.encrypt(connection.sshTunnelConfiguration.password),
        connection.sshTunnelConfiguration?.jumpConfiguration?.password && interop.data.encrypt(connection.sshTunnelConfiguration.jumpConfiguration.password),
    ]);

    connection.password = passwordHash;

    if (sshPasswordHash) {
        connection.sshTunnelConfiguration.password = sshPasswordHash;
    }

    if (sshJumpPasswordHash) {
        connection.sshTunnelConfiguration.jumpConfiguration.password = sshJumpPasswordHash;
    }

    return idb.insert('connections', connection);
}
