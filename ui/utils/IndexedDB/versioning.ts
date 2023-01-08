export default [
    {
        version: 1,
        migrate(event: any) {
            const db = event.target.result;

            const connectionsStore = db.createObjectStore('connections', { keyPath: 'id', autoIncrement: true });

            connectionsStore.createIndex('name', 'name', { unique: false });
        },
    },
];
