import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'assets/global.css';
import { Interop } from 'common/models/Interop';
import '$storage';

declare global {
    const interop: Interop;

    interface Window {
        interop: Interop;
    }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
);

postMessage({ payload: 'removeLoading' }, '*');
