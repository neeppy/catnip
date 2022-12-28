import net from 'net';
import { Client } from 'ssh2';
import { TunnelConfiguration } from 'common/models/Connection';

interface SSHConnectionConfig {
    host: string;
    port: number;
    username: string;
    password: string;
}

function createSSHConnection(configuration: SSHConnectionConfig, bindingServer: net.Socket) {
    const connection = new Client();

    bindingServer.on('close', connection.end.bind(connection));

    connection.on('ready', () => {
        connection.forwardOut(
            'localhost',
            configuration.port,
            configuration.host,
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

function createSSHServer(configuration: SSHConnectionConfig): net.Server {
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

export function createSSHTunnel(configuration: TunnelConfiguration) {
    return new Promise((resolve, reject) => {
        const server = createSSHServer({
            host: configuration.hostname,
            port: configuration.port,
            username: configuration.username,
            password: configuration.password,
        });

        server.listen(configuration.port, configuration.hostname, () => {
            console.log('SSH Server Running...');
            resolve(server);
        });
    });
}
