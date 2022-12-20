import net from 'net';
import { Client } from 'ssh2';
import { SSHTunnelConfiguration } from 'common/models/Connection';

function createSSHConnection(configuration: SSHTunnelConfiguration, bindingServer: net.Socket) {
    const connection = new Client();

    bindingServer.on('close', connection.end.bind(connection));

    connection.on('ready', () => {
        connection.forwardOut(
            'localhost',
            configuration.port ?? 22,
            configuration.hostname,
            configuration.port,
            (err, sshStream) => {
                if (err) {
                    bindingServer.emit('error', err);
                    return;
                }

                bindingServer.emit('ssh:ready', sshStream);
                bindingServer.pipe(sshStream).pipe(bindingServer);
            }
        );
    });

    return connection;
}

function createSSHServer(configuration: SSHTunnelConfiguration) {
    const connections = [];

    const server = net.createServer(emptyServer => {
        emptyServer.on('error', server.emit.bind(server, 'error'));

        const sshConnection = createSSHConnection(configuration, emptyServer);
        sshConnection.on('error', server.emit.bind(server, 'error'));

        emptyServer.on('ssh:ready', stream => {
            stream.on('error', server.close.bind(server));
        });

        connections.push(sshConnection);

        try {
            sshConnection.connect({});
        } catch (err) {
            server.emit('error', err);
        }
    });

    server.on('close', () => {
        connections.forEach(conn => conn.close());
    });

    return server;
}

export function createSSHTunnel(configuration: SSHTunnelConfiguration) {
    return new Promise((resolve, reject) => {

    });
}
