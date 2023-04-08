import { Connection } from 'common/models/Connection';
import storage from '$storage';

export async function fetchConnections(): Promise<Connection[]> {
    return storage.connections.toArray();
}

export async function getConnectionById(connectionId: string): Promise<Connection | undefined> {
    return storage.connections.get(connectionId);
}

export async function insertConnection(connection: Connection) {
    connection.id = window.crypto.randomUUID();

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

    return storage.connections.add(connection);
}
