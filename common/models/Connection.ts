export enum ConnectionDriver {
    MySQL = 'mysql',
}

export interface SSHTunnelConfiguration {
    hostname: string;
    port: number;
    username: string;
    password: string;
    jumpConfiguration: Omit<SSHTunnelConfiguration, 'jumpConfiguration'> | null;
}

export interface Connection {
    id: number;
    name: string;
    driver: ConnectionDriver;
    hostname: string;
    port: number;
    username: string;
    password: string;
    sshTunnelConfiguration: SSHTunnelConfiguration | null;
}
