import IndexedDB from './IndexedDB';
import { Connection } from 'common/models/Connection';

export async function fetchConnections() {
    const idb = await IndexedDB.getInstance();

    return idb.get<Connection>('connections');
}
