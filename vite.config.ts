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
        name: 'Gradski Parking Tuzla - Navigacija i SMS',
        short_name: 'Parking Tuzla',
        description: 'PWA Aplikacija za SMS plaćanje parkinga i navigaciju u Tuzli',
        theme_color: '#1e40af',
        background_color: '#081353ff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/public/logo192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            "src": "/public/logo350x350.png",
            "type": "image/png",
            "sizes": "350x350"
          },
          {
            src: '/public/logo512x512.png',
            sizes: '512x512',
            type: 'image/png'
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
