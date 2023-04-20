import { BrowserWindow, shell } from 'electron';
import { join } from 'path';

export default async function createWindow() {
    const preload = join(__dirname, './preload.js');
    const url = process.env.VITE_DEV_SERVER_URL;
    const indexHtml = join(process.env.DIST, 'index.html');

    const win = new BrowserWindow({
        title: 'Catnip',
        icon: join(process.env.PUBLIC, 'favicon.svg'),
        frame: false,
        titleBarStyle: 'hiddenInset',
        minWidth: 800,
        minHeight: 600,
        width: 1366,
        height: 840,
        webPreferences: {
            preload,
            contextIsolation: true,
        },
    });

    win.menuBarVisible = false;

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(url);
    } else {
        win.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString());
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });

    return win;
}
