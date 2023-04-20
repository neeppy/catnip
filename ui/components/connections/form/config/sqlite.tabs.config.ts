import { ConnectionDetailsSection } from '../sections/sqlite';

export function getSQLiteTabs(isAdvanced: boolean) {
    return [
        {
            key: 'connection',
            label: 'Parameters',
            component: ConnectionDetailsSection,
        },
    ];
}
