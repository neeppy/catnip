import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'assets/global.css';
import { Connection } from 'common/models/Connection';

declare global {
    interface Window {
        interop: {
            dialog: {
                file: () => unknown;
            };
            databases: {
                openConnection: (conn: Connection) => Promise<unknown>;
            };
        };
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
