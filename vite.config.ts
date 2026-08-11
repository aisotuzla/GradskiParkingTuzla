import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tuzla Parking - Navigacija i SMS',
        short_name: 'TuzlaPark',
        description: 'PWA Aplikacija za SMS plaćanje parkinga i navigaciju u Tuzli',
        theme_color: '#1e40af',
        background_color: '#0a142f',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon-192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'pwa-icon-512.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false
      }
    })
  ]
});
