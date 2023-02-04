import { app, ipcMain } from 'electron';
import { release } from 'os';
import { join } from 'path';
import registerInteropMessages from './routes';
import createWindow from './window';
import registerAppEventListeners from './events';
import contextMenu from 'electron-context-menu';

process.env.DIST_ELECTRON = join(__dirname, '../..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public');

contextMenu({
    showInspectElement: true,
    prepend: (defaultActions, parameters, window) => {
        console.log(parameters);

        return [
            {
                label: 'Test'
            }
        ];
    },
});

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

app.whenReady()
    .then(createWindow)
    .then(registerAppEventListeners)
    .then(registerInteropMessages)
    .then(window => {
        ipcMain.handle('@@app/close', () => {
            app.quit();
        });

        ipcMain.handle('@@app/minimize', () => {
            window.minimize();
        });

        ipcMain.handle('@@app/maximize', () => {
            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        });
    });
