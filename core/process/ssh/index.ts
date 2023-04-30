import { safeStorage } from 'electron';
import { Client, ClientChannel } from 'ssh2';
import type { SSHConnection, TunnelConfiguration } from 'common/models/Connection';

interface DatabaseTunnelConfiguration {
    hostname: string;
    port: number;
}

function connectToServer(serverConfiguration: SSHConnection, useStream?: ClientChannel): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
        const client = new Client();

        const passwordBuffer = Buffer.from(serverConfiguration.password, 'base64');

        client
            .on('error', reject)
            .on('ready', () => resolve(client))
            .connect({
                ...useStream ? { sock: useStream } : {
                    host: serverConfiguration.hostname,
                    port: serverConfiguration.port ?? 22,
                },
                username: serverConfiguration.username,
                password: safeStorage.decryptString(passwordBuffer),
            });
    });
}

function forwardSSHConnection(client: Client, configuration: SSHConnection) {
    return new Promise<ClientChannel>((resolve, reject) => {
        client.exec(`nc ${configuration.hostname} ${configuration.port || 22}`, (err, stream) => {
            if (err) {
                reject(err);
            } else {
                resolve(stream);
            }
        });
    });
}

function forwardDatabaseConnection(client: Client, configuration: DatabaseTunnelConfiguration) {
    return new Promise<ClientChannel>((resolve, reject) => {
        client.forwardOut('127.0.0.1', 3306, configuration.hostname, configuration.port || 3306, (err, stream) => {
            if (err) {
                reject(err);
            } else {
                resolve(stream);
            }
        });
    });
}

export async function createSSHTunnel(dbHost: string, dbPort: number, configuration: TunnelConfiguration) {
    let mainSSHConnection;

    if (configuration.jumpConfiguration.hostname) {
        console.log('Connecting to jump...');
        const jumpServerConnection = await connectToServer(configuration.jumpConfiguration);
        console.log('Success! Forwarding output...');
        const forwardedStream = await forwardSSHConnection(jumpServerConnection, configuration);
        console.log('Success! Connecting to main server...');
        mainSSHConnection = await connectToServer(configuration, forwardedStream);
        console.log('Success! Hopping was successful!');
    } else {
        console.log('Connecting to main server...');
        mainSSHConnection = await connectToServer(configuration);
    }

    console.log('Setting up database stream for given tunnel...');
    return forwardDatabaseConnection(mainSSHConnection, {
        hostname: dbHost,
        port: dbPort ?? 3306,
    });
}
