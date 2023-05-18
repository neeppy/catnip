import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Interop } from 'common/models/Interop';
import { AppContextMenu, AppModals } from '$module:globals';
import { App } from '$module:layout';
import '$storage';
import client from 'ui/utils/query';

declare global {
    const interop: Interop;

    type Concatenable = string | number;
    type Concat<TFirst, TSecond> = TFirst extends Concatenable ? TSecond extends Concatenable ? `${TFirst}${'' extends TSecond ? '' : '.'}${TSecond}` : never : never;

    type DeepKey<T> = T extends object ? {
        [Key in keyof T]-?: Key extends Concatenable ? `${Key}` | Concat<Key, DeepKey<T[Key]>> : never;
    }[keyof T] : '';

    type Leaves<T> = T extends object ? {
        [Key in keyof T]-?: Concat<Key, Leaves<T[Key]>>;
    }[keyof T] : '';

    type FormConfig<T extends Record<string, any>> = Partial<Record<Leaves<T>, any>> & {
        submit?: any;
    };

    interface Window {
        interop: Interop;
        theme: (theme: any) => void;
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
