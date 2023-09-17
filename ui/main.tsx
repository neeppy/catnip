import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Interop } from 'common/models/Interop';
import { AppContextMenu, AppModals, SettingsProvider } from '$module:globals';
import { App } from '$module:layout';
import client from 'ui/utils/query';
import '$storage';
import 'common/globals';

declare global {
    const interop: Interop;

    type FormConfig<T extends Record<string, any>> = Partial<Record<Leaves<T>, any>> & {
        submit?: any;
    };

    type VoidFn = () => void;

    interface Window {
        interop: Interop;
        theme: (theme: any) => void;
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <SettingsProvider>
                <App/>
                <AppContextMenu/>
                <AppModals/>
            </SettingsProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
