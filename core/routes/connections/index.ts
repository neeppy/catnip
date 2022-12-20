import { Connection } from 'common/models/Connection';

export default [
    {
        channel: '@@connection/init',
        async handle(connection: Connection) {
            const {
                hostname,
                port,
                username,
                password,
            } = connection;

            // create SSH tunnel
        },
    },
];
