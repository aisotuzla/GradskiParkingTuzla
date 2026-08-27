/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOAPIFY_API_KEY?: string;
  readonly VITE_GEOAPIFY_ROUTING_API?: string;
  readonly VITE_GEOAPIFY_MAP_TILES_API?: string;
  readonly VITE_GEOAPIFY_GEOCODING_API?: string;
  readonly VITE_CARTO_MAP_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// TypeScript declarations for Vite PWA virtual module
declare module 'virtual:pwa-register' {
  export function registerSW(options?: Record<string, any>): (reload?: boolean) => void;
}
