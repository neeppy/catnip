import { PropsWithChildren } from 'react';
import { useControlledEffect, useSettings } from 'ui/hooks';
import { registerKeyboardShortcuts } from '../../utils/keyboard';
import { registerGlobalCommands } from '../../commands';
import { registerLayoutCommands } from '../../../layout';

export function SettingsProvider({ children }: PropsWithChildren) {
    const { settings, isFetched, isFetching } = useSettings();

    useControlledEffect(() => {
        document.body.setAttribute('data-theme', settings.appearance.theme);
    }, !isFetching);

    useControlledEffect(() => {
        console.debug('[App] Settings Loaded', settings);

        registerGlobalCommands();
        registerLayoutCommands();

        const unregister = registerKeyboardShortcuts(settings.shortcuts);

        postMessage({ payload: 'removeLoading' }, '*');

        return unregister;
    }, isFetched);

    if (!isFetched) return null;

    return <>{children}</>;
}
