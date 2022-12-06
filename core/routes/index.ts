import { BrowserWindow, ipcMain } from 'electron';
import safeStorage from './safeStorage';

interface Route {
    channel: string;
    handle(data: any, window: BrowserWindow): Promise<unknown>;
}

const routes: Route[] = [
    ...safeStorage,
];

export default function registerInteropMessages(window: BrowserWindow) {
    for (const route of routes) {
        ipcMain.handle(route.channel, data => route.handle(data, window));
    }

    return window;
}
