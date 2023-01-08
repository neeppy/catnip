export enum ConnectionDriver {
    MySQL = 'mysql',
}

export interface SSHConnection {
    hostname: string;
    port: number;
    username: string;
    password: string;
}

export interface TunnelConfiguration extends SSHConnection {
    jumpConfiguration: SSHConnection;
}

export interface Connection {
    id: number;
    name: string;
    driver: ConnectionDriver;
    hostname: string;
    port: number;
    username: string;
    password: string;
    sshTunnelConfiguration: TunnelConfiguration;
}
