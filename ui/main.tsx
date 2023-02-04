import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'assets/global.css';
import { Connection } from 'common/models/Connection';

declare global {
    const interop: {
        control: {
            close: () => unknown;
            minimize: () => unknown;
            maximize: () => unknown;
        };
        data: {
            encrypt: (data: string) => Promise<string>;
        },
        dialog: {
            file: () => unknown;
        };
        connections: {
            open: (conn: Connection) => Promise<unknown>;
        };
    };

    interface Window {
        interop: typeof interop;
    }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
);

postMessage({ payload: 'removeLoading' }, '*');
