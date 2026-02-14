import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pokeapi-cache',
                            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                            cacheableResponse: { statuses: [0, 200] },
                            networkTimeoutSeconds: 10,
                        },
                    },
                ],
            },
            manifest: {
                name: 'Pokédex',
                short_name: 'Pokédex',
                description: 'Pokédex React - Busca Pokémon, tipos y evoluciones',
                theme_color: '#ef4444',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait-primary',
                icons: [
                    {
                        src: '/favicon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/shared/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
