import { PropsWithChildren } from 'react';
import { useControlledEffect, useSettings } from 'ui/hooks';

export function SettingsProvider({ children }: PropsWithChildren) {
    const { settings, isFetched, isFetching } = useSettings();

    useControlledEffect(() => {
        document.body.setAttribute('data-theme', settings.appearance.theme);
    }, !isFetching);

    useControlledEffect(() => {
        console.debug('[App] Settings Loaded', settings);

        postMessage({ payload: 'removeLoading' }, '*');
    }, isFetched);

    if (!isFetched) return null;

    return <>{children}</>;
}
