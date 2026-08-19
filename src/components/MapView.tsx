import React, { useEffect, useRef, useState } from 'react';
import { Map, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Language, NavigationRoute, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { ZONE_DETAILS } from '../data/parkingData';

interface MapViewProps {
  parkingLots: ParkingLotData[];
  selectedLot: ParkingLotData | null;
  onSelectLot: (lot: ParkingLotData) => void;
  onPaySms: (lot: ParkingLotData) => void;
  onStartNavigation: (lot: ParkingLotData) => void;
  userLocation: UserLocation | null;
  onRequestUserLocation: () => Promise<UserLocation | null>;
  activeRoute: NavigationRoute | null;
  currentLang: Language;
  filterZone: ParkingZone | 'all';
  onFilterZoneChange: (zone: ParkingZone | 'all') => void;
}

export const MapView: React.FC<MapViewProps> = ({
  parkingLots,
  selectedLot,
  onSelectLot,
  onPaySms,
  onStartNavigation,
  userLocation,
  onRequestUserLocation,
  activeRoute,
  currentLang: _currentLang,
  filterZone,
  onFilterZoneChange,
}) => {
  const [mapStyle, setMapStyle] = useState<'online' | 'offline'>('online');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onlineLayerRef = useRef<L.TileLayer | null>(null);
  const offlineLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeRef = useRef<L.Polyline | null>(null);
  const onSelectLotRef = useRef(onSelectLot);
  const onPaySmsRef = useRef(onPaySms);
  const onStartNavigationRef = useRef(onStartNavigation);
  const onRequestUserLocationRef = useRef(onRequestUserLocation);

  useEffect(() => {
    onSelectLotRef.current = onSelectLot;
    onPaySmsRef.current = onPaySms;
    onStartNavigationRef.current = onStartNavigation;
    onRequestUserLocationRef.current = onRequestUserLocation;
  }, [onSelectLot, onPaySms, onStartNavigation, onRequestUserLocation]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleToggleMapStyle = () => {
    const map = mapRef.current;
    const onlineLayer = onlineLayerRef.current;
    const offlineLayer = offlineLayerRef.current;
    if (!map || !onlineLayer || !offlineLayer) return;

    if (mapStyle === 'online') {
      if (map.hasLayer(onlineLayer)) map.removeLayer(onlineLayer);
      if (!map.hasLayer(offlineLayer)) offlineLayer.addTo(map);
      map.setMinZoom(14);
      map.setMaxZoom(17);
      map.setZoom(15);
      setMapStyle('offline');
      return;
    }

    if (map.hasLayer(offlineLayer)) map.removeLayer(offlineLayer);
    if (!map.hasLayer(onlineLayer)) onlineLayer.addTo(map);
    map.setMinZoom(3);
    map.setMaxZoom(20);
    map.setZoom(14);
    setMapStyle('online');
  };

  // Initialise Leaflet map with Carto raster tiles, then fall back to local tiles after a real offline delay.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [44.538, 18.675], // lat, lng
      zoom: 14,
      minZoom: 3,
      maxZoom: 20,
      zoomControl: false,
    });

    const onlineLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        minZoom: 3,
        maxZoom: 20,
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );

    const offlineLayer = L.tileLayer('/tile/{z}/{x}/{y}.webp', {
      minZoom: 14,
      maxZoom: 17,
      maxNativeZoom: 17,
      tileSize: 256,
      noWrap: true,
      bounds: [[44.524421222188643, 18.641298698973824], [44.545400280789757, 18.714732252107076]],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    onlineLayerRef.current = onlineLayer;
    offlineLayerRef.current = offlineLayer;

    let onlineLoaded = false;
    let usingOfflineLayer = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const switchToOfflineLayer = () => {
      if (usingOfflineLayer) return;
      usingOfflineLayer = true;
      if (map.hasLayer(onlineLayer)) {
        map.removeLayer(onlineLayer);
      }
      offlineLayer.addTo(map);
      map.setMinZoom(14);
      map.setMaxZoom(17);
      map.setZoom(15);
      setMapStyle('offline');
    };

    const scheduleOfflineFallback = () => {
      if (timeoutId || usingOfflineLayer) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!onlineLoaded || !navigator.onLine) {
          console.warn('Carto raster tiles unavailable for 10s. Switching to local offline tiles.');
          switchToOfflineLayer();
        }
      }, 10000);
    };

    onlineLayer.on('load', () => {
      onlineLoaded = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    });

    onlineLayer.addTo(map);

    scheduleOfflineFallback();
    window.addEventListener('offline', scheduleOfflineFallback);

    mapRef.current = map;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('offline', scheduleOfflineFallback);
      map.remove();
      mapRef.current = null;
      onlineLayerRef.current = null;
      offlineLayerRef.current = null;
    };
  }, []);

  // GeoJSON parking zones (shown when filterZone === 'all')
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const geoJsonDataRef = useRef<any>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (filterZone === 'all') {
      const renderGeoJson = (data: any) => {
        if (!mapRef.current) return;
        if (geoJsonLayerRef.current) {
          mapRef.current.removeLayer(geoJsonLayerRef.current);
        }
        const layer = L.geoJSON(data, {
          style: (feature) => {
            const featureFill = feature?.properties?.fill;
            const featureStroke = feature?.properties?.stroke;
            return {
              fillColor: featureFill || '#1d4ed8',
              fillOpacity: 0.1,
              color: featureStroke || '#3b82f6',
              opacity: feature?.properties?.['stroke-opacity'] ?? 0.6,
              weight: feature?.properties?.['stroke-width'] ? Number(feature.properties['stroke-width']) * 2 : 1.5,
            };
          },
        }).addTo(mapRef.current);
        geoJsonLayerRef.current = layer;
      };

      if (geoJsonDataRef.current) {
        renderGeoJson(geoJsonDataRef.current);
      } else {
        fetch('/tile/ParkingZones.geojson')
          .then((res) => res.json())
          .then((data) => {
            geoJsonDataRef.current = data;
            renderGeoJson(data);
          })
          .catch((err) => {
            console.error('Failed to load ParkingZones.geojson', err);
          });
      }
    }
  }, [filterZone]);

  // Parking markers (hidden when filterZone === 'all', shown for specific zone buttons)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (filterZone === 'all') {
      // Hide all other markers when "Sve" / "All" is active
      return;
    }

    const filtered = parkingLots.filter(lot => lot.zone === filterZone);
    filtered.forEach(lot => {
      // coordinates in parkingData are [lng, lat] (e.g., [18.67, 44.53])
      const lng = Number(lot.coordinates?.[0]);
      const lat = Number(lot.coordinates?.[1]);
      if (isNaN(lng) || isNaN(lat)) return;

      const details = ZONE_DETAILS[lot.zone];
      const div = document.createElement('div');
      div.className = 'relative cursor-pointer z-10';
      div.innerHTML = `<div class="flex flex-col items-center"><div class="w-8 h-8 rounded-full bg-[#08182e] border-2 flex items-center justify-center" style="border-color:${details.color}"><span class="text-[11px] font-black text-[#d4af37]">Z${lot.zone}</span></div></div>`;

      const icon = L.divIcon({ className: '', html: div.outerHTML, iconSize: [32, 32], iconAnchor: [16, 32] });
      const marker = L.marker([lat, lng], { icon }).addTo(map);
      
      const popupHtml = `
        <div class="p-3.5 bg-gradient-to-br from-[#091d42] via-[#06142e] to-[#030914] text-white rounded-2xl border border-[#d4af37]/40 shadow-2xl min-w-[210px] max-w-[260px]">
          <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/40 mb-1">
            Zona ${lot.zone}
          </span>
          <h3 class="font-black text-sm sm:text-base text-white leading-tight mb-0.5 truncate">${lot.name}</h3>
          <p class="text-[11px] text-slate-300 mb-3 truncate leading-snug">${lot.address}</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-map-action="sms"
              data-lot-id="${lot.id}"
              class="h-9 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-[#030914] font-black text-xs border border-[#ffe58f] shadow-md active:scale-95"
            >
              SMS
            </button>
            <button
              type="button"
              data-map-action="gps"
              data-lot-id="${lot.id}"
              class="h-9 rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] text-white font-black text-xs border border-[#60a5fa]/40 shadow-md active:scale-95"
            >
              GPS
            </button>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const popupElement = marker.getPopup()?.getElement();
        if (popupElement) {
          L.DomEvent.disableClickPropagation(popupElement);
          L.DomEvent.disableScrollPropagation(popupElement);
        }
      });
      marker.on('click', () => {
        onSelectLotRef.current(lot);
      });
      markersRef.current[lot.id] = marker;
    });
  }, [parkingLots, filterZone]);

  useEffect(() => {
    const handlePopupAction = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>('[data-map-action][data-lot-id]');
      if (!button) return;

      const lot = parkingLots.find(item => item.id === button.dataset.lotId);
      if (!lot) return;

      event.preventDefault();
      event.stopPropagation();

      if (button.dataset.mapAction === 'sms') {
        onPaySmsRef.current(lot);
        return;
      }

      if (button.dataset.mapAction === 'gps') {
        await onRequestUserLocationRef.current();
        onStartNavigationRef.current(lot);
      }
    };

    document.addEventListener('click', handlePopupAction, true);
    return () => document.removeEventListener('click', handlePopupAction, true);
  }, [parkingLots]);

  // Highlight selected lot and fly to it (only if no active navigation route)
  useEffect(() => {
    if (!selectedLot || activeRoute) return;
    const marker = markersRef.current[selectedLot.id];
    if (marker) {
      marker.openPopup();
      // coordinates are [lng, lat]
      const lng = Number(selectedLot.coordinates?.[0]);
      const lat = Number(selectedLot.coordinates?.[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current?.flyTo([lat, lng], 15);
      }
    }
  }, [selectedLot, activeRoute]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userLocation && !isNaN(userLocation.lat) && !isNaN(userLocation.lng)) {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md';
      const icon = L.divIcon({ className: '', html: el.outerHTML, iconSize: [16, 16], iconAnchor: [8, 8] });
      const marker = L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map);
      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // Route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }
    if (activeRoute?.coordinates?.length) {
      const coords = activeRoute.coordinates
        .filter(c => Array.isArray(c) && c.length >= 2 && !isNaN(c[0]) && !isNaN(c[1]))
        .map(c => [c[0], c[1]] as [number, number]); // route coordinates are already [lat, lng]
      const poly = L.polyline(coords, {
        color: '#1677ff',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routeRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [38, 38], maxZoom: 20 });
    }
  }, [activeRoute]);

  return (
    <div className="relative isolate z-0 w-full h-full overflow-hidden bg-[#040a17]" onContextMenu={e => e.preventDefault()}>
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />
      <button
        type="button"
        onClick={handleToggleMapStyle}
        className="absolute bottom-6 left-3 z-30 w-9 h-9 rounded-full bg-[#061d40]/95 backdrop-blur-md border border-[#d4af37]/40 text-[#ffd77a] shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-center active:scale-95"
        aria-label={`Switch to ${mapStyle === 'online' ? 'offline' : 'online'} map style`}
        title={`Switch to ${mapStyle === 'online' ? 'offline' : 'online'} map style`}
      >
        <Map className="w-4 h-4" />
      </button>
      {/* Zone filter bar */}
      <div className="absolute top-3 left-3 z-30 flex items-center justify-start pointer-events-none">
        <div className="pointer-events-auto flex gap-1 bg-[#061d40]/95 backdrop-blur-md p-1 rounded-full border border-[#d4af37]/40 shadow-[0_0_0_1px_rgba(255,229,143,0.08),0_10px_30px_rgba(0,0,0,0.35)]">
          <button
            onClick={() => onFilterZoneChange('all')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${filterZone === 'all' ? 'bg-gradient-to-r from-[#1d4ed8] via-[#1e3a8a] to-[#08153b] text-white border border-[#d4af37]/50 shadow-[0_0_18px_rgba(29,78,216,0.35)]' : 'text-slate-300 hover:text-white'}`}
          >SVE</button>
          {(['0', '1', '2'] as ParkingZone[]).map(zone => (
            <button
              key={zone}
              onClick={() => onFilterZoneChange(zone)}
              className={`px-2 py-1 rounded-full border text-xs font-bold transition-all ${filterZone === zone ? 'bg-gradient-to-r from-[#1d4ed8] via-[#1e3a8a] to-[#08153b] text-white border-[#d4af37]/60 shadow-[0_0_18px_rgba(212,175,55,0.22)]' : 'bg-[#041530] border-[#d4af37]/30 text-[#ffd77a]'}`}
            >Z{zone}</button>
          ))}
        </div>
      </div>
      <div className="absolute top-3 right-3 z-30 pointer-events-auto flex flex-col gap-1 bg-[#061d40]/95 backdrop-blur-md p-0.5 rounded-full border border-[#d4af37]/40 shadow-[0_0_0_1px_rgba(255,229,143,0.08),0_10px_30px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-full bg-[#041530] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center hover:bg-[#062844] transition-colors active:scale-95"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-full bg-[#041530] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center hover:bg-[#062844] transition-colors active:scale-95"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
