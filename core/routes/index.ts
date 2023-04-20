import { BrowserWindow, ipcMain } from 'electron';
import connections from './connections';
import security from './security';
import database from './database';
import dialog from './control/dialog';
import { Route } from './types';

const routes: Route[] = [
    ...connections,
    ...database,
    ...security,
    ...dialog,
];

export default function registerInteropMessages(window: BrowserWindow) {
    for (const route of routes) {
        ipcMain.handle(route.channel, (event, ...args) => route.handle({ event, window }, ...args));
    }

    return window;
}
