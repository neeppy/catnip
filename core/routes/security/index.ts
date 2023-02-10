import { safeStorage } from "electron";
import { Route } from '../types';

export default [
    {
        channel: '@@data/encrypt',
        async handle(event, data: string) {
            if (!data) {
                return null;
            }

            return safeStorage.encryptString(data)
                .toString('base64');
        },
    },
] as Route[];
