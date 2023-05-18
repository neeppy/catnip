import { ConnectionDetailsSection } from './tabs/ConnectionDetailsSection';
import { SSHTunnelSection } from './tabs/SSHTunnelSection';

export default function getFormTabs(isAdvanced: boolean) {
    const config = [
        {
            key: 'connection',
            label: 'Connection',
            collapsedWidth: 100,
            component: ConnectionDetailsSection,
        },
    ];

    if (isAdvanced) {
        config.push({
            key: 'ssh',
            label: 'SSH Tunneling',
            collapsedWidth: 140,
            component: SSHTunnelSection,
        });
    }

    return config;
}
