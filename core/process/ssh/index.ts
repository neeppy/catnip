import { Client, ClientChannel } from 'ssh2';
import type { SSHConnection, TunnelConfiguration } from 'common/models/Connection';

function connectToServer(serverConfiguration: SSHConnection, useStream?: ClientChannel) {
    return new Promise<Client>((resolve, reject) => {
        const client = new Client();

        client
            .on('error', reject)
            .on('ready', () => resolve(client))
            .connect({
                ...useStream ? {
                    sock: useStream,
                } : {
                    host: serverConfiguration.hostname,
                    port: serverConfiguration.port,
                },
                username: serverConfiguration.username,
                password: serverConfiguration.password,
            });
    });
}

function sshForwardOut(client: Client, configuration: SSHConnection) {
    return new Promise<ClientChannel>((resolve, reject) => {
        client.forwardOut('127.0.0.1', configuration.port, configuration.hostname, configuration.port, async (err, stream) => {
            if (err) {
                reject(err);
            } else {
                resolve(stream);
            }
        });
    });
}

export async function createSSHTunnel(configuration: TunnelConfiguration) {
    if (configuration.jumpConfiguration) {
        console.log('Connecting to jump...');
        const jumpServerConnection = await connectToServer(configuration.jumpConfiguration);
        console.log('Success! Forwarding output...');
        const forwardedStream = await sshForwardOut(jumpServerConnection, configuration);
        console.log('Success! Connecting to main server...');
        const mainSSHConnection = await connectToServer(configuration, forwardedStream);
        console.log('Success! Hopping was successful!');

    } else {
        return connectToServer(configuration);
    }
}
