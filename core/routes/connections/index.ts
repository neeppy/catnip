import { Connection } from 'common/models/Connection';
import tunnel from 'tunnel-ssh';

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

            tunnel({
                host: hostname,
                dstPort: port ?? 22,
                username,
                password,
            }, (err, args) => {
                console.log(err, args);
            });
        },
    },
];
