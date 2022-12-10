import { rmSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true });

export default defineConfig({
    resolve: {
        alias: {
            'ui': path.join(__dirname, 'ui'),
            'assets': path.join(__dirname, 'ui/assets'),
            'common': path.join(__dirname, 'common'),
        },
    },
    plugins: [
        react(),
        electron({
            entry: [
                'core/main.ts',
                'core/preload.ts',
            ],
        }),
        renderer(),
    ],
    clearScreen: false,
});
