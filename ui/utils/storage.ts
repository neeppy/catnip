import Dexie, { Table, Version } from 'dexie';
import { AnyConnection } from 'common/models/Connection';
import { AnyTab } from '$module:tabs';
import { Group } from '$module:connections';

const versioning = [
    {
        version: 1,
        migrate(version: Version) {
            version.stores({
                connections: '&id, groupId',
                tabs: '&id, connectionId, type',
                groups: '&id',
            });
        }
    }
];

class CatnipDexie extends Dexie {
    connections!: Table<AnyConnection>;
    tabs!: Table<AnyTab>;
    groups!: Table<Group>;

    constructor() {
        super('catnip');

        const latestVersion = versioning[0];
        const version = this.version(latestVersion.version);

        latestVersion.migrate(version);
    }
}

const storage = new CatnipDexie();

export default storage;
