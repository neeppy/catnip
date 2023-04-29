import { ConnectionDetailsSection, SSHTunnelSection } from '$module:connections/form/sections/mysql';

export function getMySQLTabsConfig(isAdvanced: boolean) {
    const config = [
        {
            key: 'connection',
            label: 'Connection',
            component: ConnectionDetailsSection,
        },
    ];

    if (isAdvanced) {
        config.push({
            key: 'ssh',
            label: 'SSH Tunneling',
            component: SSHTunnelSection,
        });
    }

    return config;
}
