import storage from '$storage';
import { AnyConnection } from 'common/models/Connection';
import { Group } from '../models';
import client from 'ui/utils/query';
import { useConnectionOrder } from './state';

export interface ConnectionGroup extends Group {
    connections: AnyConnection[];
}

export async function fetchGroupedConnections() {
    const connections = await storage.connections.toArray();
    const groups = await storage.groups.toArray();

    const groupedConnections: ConnectionGroup[] = groups.map(group => ({
        ...group,
        connections: connections.filter(conn => conn.groupId === group.id),
    }));

    const ungroupedConnections = connections.filter(conn => typeof conn.groupId === 'undefined');

    const { order, reset } = useConnectionOrder.getState();

    // initial connection order
    if (order.length === 0) {
        reset(ungroupedConnections.map(conn => conn.id));
    }

    return {
        groups: groupedConnections,
        connections: ungroupedConnections,
    };
}

export async function createEmptyGroup(name: string): Promise<Group> {
    const group = {
        id: window.crypto.randomUUID(),
        name,
    };

    await storage.groups.add(group);

    return group;
}

export async function groupConnections(...connections: AnyConnection[]) {
    const groupNo = await storage.groups.count();
    const group = await createEmptyGroup(`Group #${groupNo + 1}`);

    await addToGroup(group.id, ...connections);
}

export async function ungroupConnections(...connections: AnyConnection[]) {
    await storage.connections.bulkPut(
        connections.map(({ groupId, ...conn }) => conn)
    );

    useConnectionOrder.getState().push(connections.map(conn => conn.id));

    await Promise.all([
        client.refetchQueries(['connections', 'grouped']),
        client.refetchQueries(['connections']),
    ]);
}

export async function addToGroup(groupId: string, ...connections: AnyConnection[]) {
    const ids = connections.map(conn => conn.id);

    useConnectionOrder.getState().drop(ids);

    await storage.connections.bulkPut(
        connections.map(conn => ({ ...conn, groupId }))
    );

    await Promise.all([
        client.refetchQueries(['connections', 'grouped']),
        client.refetchQueries(['connections']),
    ]);
}

export async function deleteGroup(groupId: string) {
    const connections = await storage.connections.where('groupId')
        .equals(groupId)
        .toArray();

    await Promise.all([
        storage.groups.delete(groupId),
        storage.connections.bulkPut(connections.map(({ groupId, ...conn }) => conn)),
    ]);

    useConnectionOrder.getState().push(connections.map(conn => conn.id));

    await Promise.all([
        client.refetchQueries(['connections', 'grouped']),
        client.refetchQueries(['connections']),
    ]);
}

export async function fetchConnections(): Promise<AnyConnection[]> {
    return storage.connections.toArray();
}
