import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import safeStorage from './safeStorage';
import connections from './connections';

interface Route {
    channel: string;
    handle(data: any, event: IpcMainInvokeEvent): Promise<unknown>;
}

const routes: Route[] = [
    ...safeStorage,
    ...connections,
];

export default function registerInteropMessages(window: BrowserWindow) {
    for (const route of routes) {
        ipcMain.handle(route.channel, (event, params: any) => route.handle(params, event));
    }

    return window;
}
