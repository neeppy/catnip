import { activeConnection, getConnectionTabs } from 'ui/components/tabs';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';

export function useActiveTab() {
    const [connection] = useAtom(activeConnection);
    const { data: tabs } = useQuery(['tabs', connection?.id], () => getConnectionTabs(connection!.id), { enabled: !!connection });

    if (!tabs || tabs.length === 0) {
        return null;
    }

    return tabs.find(tab => tab.isActive) ?? null;
}
