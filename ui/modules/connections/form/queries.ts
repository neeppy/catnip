import { AnyConnection } from 'common/models/Connection';
import storage from '$storage';
import { useConnectionOrder } from '../list';
import { connectionDriverMappings, GenericMappingFunction } from './mappers';

export async function insertConnection(connection: AnyConnection) {
    connection.id = window.crypto.randomUUID();

    const mappings = connectionDriverMappings[connection.driver] as GenericMappingFunction;
    connection = await mappings(connection);

    useConnectionOrder.getState().push(connection.id);

    return storage.connections.add(connection);
}

export async function updateConnection(connection: AnyConnection) {
    const existingConnection = await storage.connections.get(connection.id);

    if (!existingConnection) throw new Error(`Attempting to update connection with ID "${connection.id}" which doesn't exist.`);

    const mappings = connectionDriverMappings[connection.driver] as GenericMappingFunction;
    connection = await mappings(connection, existingConnection);

    return storage.connections.put(connection);
}
