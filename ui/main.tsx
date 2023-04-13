import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'assets/global.css';
import { Interop } from 'common/models/Interop';
import '$storage';
import client from 'ui/utils/query';
import AppContextMenu from 'ui/components/context-menu';
import AppModals from 'ui/components/modals';

declare global {
    const interop: Interop;

    interface Window {
        interop: Interop;
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <App/>
            <AppContextMenu/>
            <AppModals/>
        </QueryClientProvider>
    </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
