import { ConnectionDetailsSection } from './tabs/ConnectionDetailsSection';

export default function getFormTabs(isAdvanced: boolean) {
    return [
        {
            key: 'connection',
            label: 'Parameters',
            component: ConnectionDetailsSection,
        },
    ];
}
