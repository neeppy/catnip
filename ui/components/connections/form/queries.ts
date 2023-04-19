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
        connection.sshTunnelConfiguration.password && interop.data.encrypt(connection.sshTunnelConfiguration.password),
        connection.sshTunnelConfiguration.jumpConfiguration?.password && interop.data.encrypt(connection.sshTunnelConfiguration.jumpConfiguration.password),
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

export async function updateConnection(connection: Connection) {
    const existingConnection = await getConnectionById(connection.id);

    if (!existingConnection) throw new Error(`Attempting to update connection with ID "${connection.id}" which doesn't exist.`);

    const passwordUpdatePromises = [];

    if (existingConnection.password !== connection.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(connection.password)
                .then(hashed => (connection.password = hashed))
        );
    }

    if (existingConnection.sshTunnelConfiguration.password !== connection.sshTunnelConfiguration.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(connection.sshTunnelConfiguration.password)
                .then(hashed => (connection.sshTunnelConfiguration.password = hashed))
        );
    }

    if (existingConnection.sshTunnelConfiguration.jumpConfiguration.password !== connection.sshTunnelConfiguration.jumpConfiguration.password) {
        passwordUpdatePromises.push(
            interop.data.encrypt(connection.sshTunnelConfiguration.jumpConfiguration.password)
                .then(hashed => (connection.sshTunnelConfiguration.jumpConfiguration.password = hashed))
        );
    }

    await Promise.all(passwordUpdatePromises);

    return storage.connections.put(connection);
}
