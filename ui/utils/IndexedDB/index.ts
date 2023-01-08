import versioning from './versioning';

export default class IndexedDB {
    static #instance: IndexedDB;
    #database: IDBDatabase;

    static async getInstance() {
        if (!this.#instance) {
            const database = await new Promise<IDBDatabase>((resolve, reject) => {
                const { version, migrate } = versioning[0];

                const request = indexedDB.open('catnip', version);

                request.onerror = reject;
                request.onupgradeneeded = migrate;
                request.onsuccess = (event: any) => resolve(event.target.result);
            });

            this.#instance = new this(database);
        }

        return this.#instance;
    }

    constructor(database: IDBDatabase) {
        this.#database = database;
    }

    async get<T>(table: string, key?: any): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const req = this.#database.transaction([table], 'readonly')
                .objectStore(table)
                .getAll(key);

            req.onerror = reject;
            req.onsuccess = () => resolve(req.result);
        });
    }

    async insert(table: string, data: any) {
        return new Promise((resolve, reject) => {
            const req = this.#database.transaction([table], 'readwrite')
                .objectStore(table)
                .add(data);

            req.onerror = reject;
            req.onsuccess = resolve;
        });
    }

    async update(table: string, key: number, data: any) {
        return new Promise((resolve, reject) => {
            const req = this.#database.transaction([table], 'readwrite')
                .objectStore(table)
                .put(data, key);

            req.onerror = reject;
            req.onsuccess = resolve;
        });
    }
}
