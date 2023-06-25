import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SettingChange, Settings, getDefaultSettings } from 'common/models/Settings';
import { path } from 'ramda';

export function useSettings() {
    const client = useQueryClient();

    const { data: settings, isFetched, isFetching } = useQuery({
        queryKey: ['settings'],
        queryFn: interop.settings.fetch,
        staleTime: 3600 * 1000,
    });

    const { mutateAsync } = useMutation<void, void, SettingChange[]>({
        mutationFn: data => interop.settings.update(data),
        onSuccess: () => client.invalidateQueries(['settings']),
    });

    function updateSetting<T extends Leaves<Settings> = Leaves<Settings>>(key: T, value: LeafType<Settings, T>) {
        const prevValue = path(key.split('.'), settings);
        
        console.debug(`[App] Setting key "${key}" changed.\n\t\tOld value:`, prevValue, '\n\t\tNew value:', value);

        return mutateAsync([{ key, value }]);
    }

    return {
        settings: settings ?? getDefaultSettings(),
        updateSetting,
        isFetched,
        isFetching,
    } as const;
}
