import { app, BrowserWindow } from 'electron';
import createWindow from './window';

export default function registerAppEventListeners(window) {
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('second-instance', () => {
        if (window.isMinimized()) {
            window.restore();
        }

        window.focus();
    });

    app.on('activate', () => {
        const allWindows = BrowserWindow.getAllWindows();

        if (allWindows.length) {
            allWindows[0].focus();
        } else {
            return createWindow();
        }
    });

    return window;
}
