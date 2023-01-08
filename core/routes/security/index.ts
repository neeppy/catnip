import { safeStorage } from "electron";

export default [
    {
        channel: '@@data/encrypt',
        async handle(data: string) {
            if (!data) {
                return null;
            }

            return safeStorage.encryptString(data)
                .toString('base64');
        },
    },
];
