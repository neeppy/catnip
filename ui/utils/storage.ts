import Dexie, { Table, Version } from 'dexie';
import { Connection } from 'common/models/Connection';

const versioning = [
    {
        version: 1,
        migrate(version: Version) {
            version.stores({
                connections: '&id',
                tabs: '&id, connectionId, type'
            });
        }
    }
];

class CatnipDexie extends Dexie {
    connections!: Table<Connection>;

    constructor() {
        super('catnip');

        const latestVersion = versioning[0];
        const version = this.version(latestVersion.version);

        latestVersion.migrate(version);
    }
}

const storage = new CatnipDexie();

export default storage;
