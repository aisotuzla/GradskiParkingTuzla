import React, { useEffect, useRef } from 'react';
import { Locate } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Language, NavigationRoute, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { ZONE_DETAILS, TUZLA_PARKING_ZONE_POLYGON } from '../data/parkingData';
import { TRANSLATIONS } from '../data/translations';

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
  currentLang,
  filterZone,
  onFilterZoneChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeRef = useRef<L.Polyline | null>(null);
  const t = TRANSLATIONS[currentLang];

  // Initialise Leaflet map with Carto raster tiles, then fall back to local tiles after a real offline delay.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [44.538, 18.675], // lat, lng
      zoom: 19,
      minZoom: 14,
      maxZoom: 20,
    });

    const onlineLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        minZoom: 14,
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
    };
  }, []);

  // Zone 0 red polygon (shown for zone 0 or all)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if ((map as any)._zoneLayer) {
      map.removeLayer((map as any)._zoneLayer);
      (map as any)._zoneLayer = null;
    }

    if (filterZone === 'all' || filterZone === '0') {
      const rawCoords = TUZLA_PARKING_ZONE_POLYGON.polygons;
      const leafletCoords = rawCoords
        .filter(p => Array.isArray(p) && p.length >= 2 && !isNaN(p[0]) && !isNaN(p[1]))
        .map(p => [p[1], p[0]] as [number, number]); // Leaflet expects [lat, lng]

      const poly = L.polygon(leafletCoords, {
        color: TUZLA_PARKING_ZONE_POLYGON.color,
        fillColor: TUZLA_PARKING_ZONE_POLYGON.fillColor || TUZLA_PARKING_ZONE_POLYGON.color,
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);

      (map as any)._zoneLayer = poly;
    }
  }, [filterZone]);

  // Parking markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    const filtered = parkingLots.filter(lot => filterZone === 'all' || lot.zone === filterZone);
    filtered.forEach(lot => {
      // coordinates in parkingData are [lng, lat] (e.g., [18.67, 44.53])
      const lng = Number(lot.coordinates?.[0]);
      const lat = Number(lot.coordinates?.[1]);
      if (isNaN(lng) || isNaN(lat)) return;

      const details = ZONE_DETAILS[lot.zone];
      const isSelected = selectedLot?.id === lot.id;
      const div = document.createElement('div');
      div.className = `relative cursor-pointer ${isSelected ? 'z-50' : 'z-10'}`;
      div.innerHTML = `<div class="flex flex-col items-center"><div class="w-8 h-8 rounded-full bg-[#08182e] border-2 flex items-center justify-center" style="border-color:${details.color}"><span class="text-[11px] font-black text-[#d4af37]">Z${lot.zone}</span></div></div>`;

      const icon = L.divIcon({ className: '', html: div.outerHTML, iconSize: [32, 32], iconAnchor: [16, 32] });
      const marker = L.marker([lat, lng], { icon }).addTo(map);
      
      const popupHtml = `
        <div class="p-3.5 bg-gradient-to-br from-[#091d42] via-[#06142e] to-[#030914] text-white rounded-2xl border border-[#d4af37]/40 shadow-2xl min-w-[210px] max-w-[260px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/40">
              Zona ${lot.zone}
            </span>
          </div>
          <h3 class="font-black text-sm sm:text-base text-white leading-tight mb-0.5 truncate">${lot.name}</h3>
          <p class="text-[11px] text-slate-300 mb-3 truncate leading-snug">${lot.address}</p>
          
          <div class="flex gap-2">
            <button 
              id="sms-${lot.id}" 
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-[#030914] font-black text-xs border border-[#ffe58f] shadow-md hover:brightness-110 active:scale-95 active:bg-[#030914] active:text-[#f3e5ab] active:border-[#d4af37] transition-all"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
              <span>SMS</span>
            </button>
            <button 
              id="nav-${lot.id}" 
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] text-white font-bold text-xs border border-[#60a5fa]/40 shadow-md hover:brightness-125 active:scale-95 active:bg-[#d4af37] active:text-[#030914] transition-all"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              <span>GPS</span>
            </button>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const smsBtn = document.getElementById(`sms-${lot.id}`);
        const navBtn = document.getElementById(`nav-${lot.id}`);
        if (smsBtn) smsBtn.onclick = e => { e.stopPropagation(); onPaySms(lot); };
        if (navBtn) {
          navBtn.onclick = async e => {
            e.stopPropagation();
            await onRequestUserLocation();
            onStartNavigation(lot);
          };
        }
      });
      marker.on('click', () => { onSelectLot(lot); });
      markersRef.current[lot.id] = marker;
    });
  }, [parkingLots, filterZone, selectedLot, onPaySms, onStartNavigation, onRequestUserLocation]);

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
        mapRef.current?.flyTo([lat, lng], 19);
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
    <div className="relative w-full h-full bg-[#040a17]" onContextMenu={e => e.preventDefault()}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Locate button */}
      <button
        onClick={onRequestUserLocation}
        className="absolute bottom-6 left-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd86b] via-[#d4af37] to-[#8f6a13] text-[#041530] flex items-center justify-center shadow-[0_0_0_1px_rgba(255,229,143,0.4),0_12px_30px_rgba(0,0,0,0.45),0_0_20px_rgba(212,175,55,0.35)] hover:brightness-110 transition-transform active:scale-95 border border-[#fff0a8]/50"
        title={t.parkingList.locateClosest}
      >
        <Locate className="w-6 h-6 animate-pulse" />
      </button>
      {/* Zone filter bar */}
      <div className="absolute top-3 right-3 flex items-center justify-end pointer-events-none">
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
            >(Z{zone})</button>
          ))}
        </div>
      </div>
    </div>
  );
};
