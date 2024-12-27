import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import {svelte} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    server: {
        hmr: true, // Включение HMR
        // hmr: false, // Отключение HMR
    },
    plugins: [
        laravel({
            input: ['resources/css/svelte/app.css', 'resources/js/svelte/main.ts'],
            refresh: true,
        }),
        svelte(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources'),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.mjs', '.svelte']
    }
});
