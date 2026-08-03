import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        registerType: 'autoUpdate',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,json}', 'tile/**/*.{png,webp,jpg,jpeg}'],
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50 MB cache limit
        }
      })
    ],
    optimizeDeps: {
      exclude: ['maplibre-gl']
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 2000, // 2 MB limit
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['axios', 'lodash', 'maplibre-gl'],
          }
        }
      }
    }
  };
});
