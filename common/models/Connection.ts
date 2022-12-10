export enum ConnectionDriver {
    MySQL = 'mysql',
}

interface SSHTunnelConfiguration {
    hostname: string;
    port: number;
    username: string;
    password: string;
    jumpConfiguration: Omit<SSHTunnelConfiguration, 'jumpConfiguration'>;
}

export interface Connection {
    id: number;
    name: string;
    driver: ConnectionDriver;
    hostname: string;
    port: number;
    username: string;
    password: string;
    sshTunnelConfiguration: SSHTunnelConfiguration;
}
