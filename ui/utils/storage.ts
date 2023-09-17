import Dexie, { Table, Version } from 'dexie';
import { AnyConnection } from 'common/models/Connection';
import { Tab } from '$module:tabs';
import { Group } from '$module:connections';

const versioning = [
    {
        version: 1,
        migrate(version: Version) {
            version.stores({
                connections: '&id, groupId',
                tabs: '&id, createdAt',
                groups: '&id',
            });
        }
    }
];

class CatnipDexie extends Dexie {
    connections!: Table<AnyConnection>;
    tabs!: Table<Tab>;
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
