import { Connection } from 'common/models/Connection';
import { createSSHTunnel } from 'core/process/ssh';

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
            await createSSHTunnel(connection.sshTunnelConfiguration);
        },
    },
];
