import { rmSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true });

export default defineConfig({
    resolve: {
        alias: [
            { find: 'ui', replacement: path.join(__dirname, 'ui') },
            { find: 'common', replacement: path.join(__dirname, 'common') },
            { find: '$components', replacement: path.join(__dirname, 'ui/components') },
            { find: '$storage', replacement: path.join(__dirname, 'ui/utils/storage') },
            { find: /\$module:(\w+)/, replacement: path.join(__dirname, 'ui/modules/$1') }
        ],
    },
    plugins: [
        react(),
        electron({
            vite: {
                build: {
                    rollupOptions: {
                        external: ['ssh2', 'better-sqlite3'],
                    },
                },
                resolve: {
                    alias: {
                        'core': path.join(__dirname, 'core'),
                        'common': path.join(__dirname, 'common'),
                    },
                },
            },
            entry: [
                'core/main.ts',
                'core/preload.ts',
            ],
        }),
        renderer(),
    ],
    clearScreen: false,
});
