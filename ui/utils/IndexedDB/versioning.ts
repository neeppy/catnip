export default [
    {
        version: 1,
        migrate(event: any) {
            const db = event.target.result;

            db.createObjectStore('connections', { keyPath: 'id' });
        },
    },
];
