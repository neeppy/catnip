import { dialog } from 'electron';
import { Route } from '../types';

export default [
    {
        channel: '@@dialog/file',
        async handle(event): Promise<string | null> {
            const result = await dialog.showOpenDialog(event.window, {
                properties: ['openFile']
            });

            if (result.canceled) {
                return null;
            }

            return result.filePaths[0] as string;
        },
    },
] as Route[];
