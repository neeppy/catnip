import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import connections from './connections';
import security from './security';

interface Route {
    channel: string;
    handle(data: any, event: IpcMainInvokeEvent): Promise<unknown>;
}

const routes: Route[] = [
    ...connections,
    ...security,
];

export default function registerInteropMessages(window: BrowserWindow) {
    for (const route of routes) {
        ipcMain.handle(route.channel, (event, params: any) => route.handle(params, event));
    }

    return window;
}
