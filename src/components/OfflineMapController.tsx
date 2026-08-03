import React, { useEffect, useState } from 'react';
import * as maplibregl from 'maplibre-gl';

interface OfflineMapControllerProps {
  map: maplibregl.Map | null;
}

export const OfflineMapController: React.FC<OfflineMapControllerProps> = ({ map }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const manageOfflineLayer = () => {
      if (!map.isStyleLoaded()) return;

      const sourceId = 'offline-tiles';
      const layerId = 'offline-tiles-layer';

      if (isOffline) {
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'raster',
            tiles: ['/tile/{z}/{x}/{y}.png'],
            tileSize: 256,
            minzoom: 14,
            maxzoom: 19
          });
        }
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            minzoom: 14,
            maxzoom: 22
          });
        }
      } else {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      }
    };

    if (map.isStyleLoaded()) {
      manageOfflineLayer();
    } else {
      map.on('style.load', manageOfflineLayer);
    }
    
    // Also re-apply when style loads, in case map style changes
    map.on('load', manageOfflineLayer);

    return () => {
      map.off('style.load', manageOfflineLayer);
      map.off('load', manageOfflineLayer);
    };
  }, [map, isOffline]);

  return null;
};
