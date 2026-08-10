import React, { useEffect, useRef, useState } from 'react';
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
  onRequestUserLocation: () => void;
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

  // Initialise Leaflet map with fast raster tiles (CARTO Voyager primary, OSM fallback)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [44.538, 18.675], // lat, lng
      zoom: 15,
    });

    const cartoUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const cartoLayer = L.tileLayer(cartoUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    });

    const osmLayer = L.tileLayer(osmUrl, {
      attribution: '&copy; OpenStreetMap contributors',
    });

    let loaded = false;

    cartoLayer.on('load', () => {
      loaded = true;
    });

    cartoLayer.addTo(map);

    // 10-second fallback timer if CARTO fails or takes too long to load
    const timeoutId = setTimeout(() => {
      if (!loaded) {
        console.warn('Primary CARTO tiles load timed out (>10s). Falling back to OpenStreetMap tiles.');
        if (map.hasLayer(cartoLayer)) {
          map.removeLayer(cartoLayer);
        }
        osmLayer.addTo(map);
      }
    }, 10000);

    cartoLayer.on('tileerror', () => {
      if (!loaded) {
        console.warn('CARTO tile error detected. Falling back to OpenStreetMap tiles.');
        clearTimeout(timeoutId);
        if (map.hasLayer(cartoLayer)) {
          map.removeLayer(cartoLayer);
        }
        osmLayer.addTo(map);
      }
    });

    mapRef.current = map;
    return () => {
      clearTimeout(timeoutId);
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
            ${lot.capacity ? `<span class="text-[11px] font-mono text-slate-300 font-semibold">${lot.capacity} mj.</span>` : ''}
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
        if (navBtn) navBtn.onclick = e => { e.stopPropagation(); onStartNavigation(lot); };
      });
      marker.on('click', () => { onSelectLot(lot); });
      markersRef.current[lot.id] = marker;
    });
  }, [parkingLots, filterZone, selectedLot]);

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
        mapRef.current?.flyTo([lat, lng], 17);
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
        .map(c => [c[1], c[0]] as [number, number]); // [lat, lng]
      const poly = L.polyline(coords, { color: '#3B82F6', weight: 5, opacity: 0.9 }).addTo(map);
      routeRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [50, 50] });
    }
  }, [activeRoute]);

  return (
    <div className="relative w-full h-full bg-[#040a17]" onContextMenu={e => e.preventDefault()}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Locate button */}
      <button
        onClick={onRequestUserLocation}
        className="absolute bottom-6 left-3 w-12 h-12 rounded-full bg-[#d4af37] text-[#041530] flex items-center justify-center shadow-xl hover:bg-[#b8860b] transition-transform active:scale-95 border border-[#d4af37]/50"
        title={t.parkingList.locateClosest}
      >
        <Locate className="w-6 h-6 animate-pulse" />
      </button>
      {/* Zone filter bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex gap-1 bg-[#061d40]/95 backdrop-blur-md p-1 rounded-full border border-[#d4af37]/40 shadow-xl">
          <button
            onClick={() => onFilterZoneChange('all')}
            className={`px-2 py-1 rounded-full text-xs font-bold ${filterZone === 'all' ? 'bg-[#d4af37] text-[#041530]' : 'text-slate-300 hover:text-white'}`}
          >Sve</button>
          <button
            onClick={() => onFilterZoneChange('0')}
            className={`px-2 py-1 rounded-full border ${filterZone === '0' ? 'bg-red-500 text-white border-red-400' : 'bg-[#041530] border-red-500/40 text-red-400'}`}
          >Z0</button>
        </div>
      </div>
    </div>
  );
};
