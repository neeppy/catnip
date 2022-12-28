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
        dialog: {
            file: () => unknown;
        };
        databases: {
            openConnection: (conn: Connection) => Promise<unknown>;
        };
    };

    interface Window {
        interop: typeof interop;
    }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
