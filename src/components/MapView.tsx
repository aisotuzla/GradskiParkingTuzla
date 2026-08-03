import React, { useEffect, useRef, useState } from 'react';
import { GEOAPIFY_API_KEY } from '../services/routingService';
import { Locate } from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { ZONE_DETAILS, TUZLA_PARKING_ZONE_POLYGON } from '../data/parkingData';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TRANSLATIONS } from '../data/translations';
import { OfflineMapController } from './OfflineMapController';

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
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [is3D, setIs3D] = useState(false);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const t = TRANSLATIONS[currentLang];

  const defaultCenter: [number, number] = [18.675, 44.538];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Primary style: osm-liberty JSON from Geoapify
    const primaryStyleUrl = `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${GEOAPIFY_API_KEY}`;
    // Fallback raster style using osm-bright tiles
    const fallbackStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-bright': {
          type: 'raster',
          tiles: [`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 20
        }
      },
      layers: [
        {
          id: 'osm-bright-layer',
          type: 'raster',
          source: 'osm-bright',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: primaryStyleUrl,
      center: defaultCenter,
      zoom: 15,
      minZoom: 10,
      maxZoom: 19,
      pitchWithRotate: true,
      dragRotate: true,
    });

    mapInstanceRef.current = map;
    setMapInstance(map);

    // Right-click toggles 3D perspective view
    map.getCanvas().addEventListener('contextmenu', (e) => {
      e.preventDefault();
      setIs3D(prev => !prev);
    });

    // If the primary Geoapify style fails (e.g., network issues), fall back to raster tiles
    map.on('error', (e) => {
      if (e.error && e.error.message && e.error.message.toLowerCase().includes('style')) {
        console.warn('Primary style failed to load. Switching to fallback raster tiles.');
        map.setStyle(fallbackStyle);
      }
    });

    map.on('load', () => {
      map.addSource('buildings', {
        type: 'geojson',
        data: '/buildings.geojson'
      });

      map.addLayer({
        id: 'buildings-layer',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': '#bcb8b3',
          'fill-opacity': 0.8
        }
      });

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3B82F6',
          'line-width': 6,
          'line-opacity': 0.9
        }
      });

      map.addSource('zone-polygons', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'zone-polygons-fill',
        type: 'fill',
        source: 'zone-polygons',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity']
        }
      });

      map.addLayer({
        id: 'zone-polygons-line',
        type: 'line',
        source: 'zone-polygons',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-dasharray': [4, 4]
        }
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    try {
      const features: any[] = [];
      if (filterZone === 'all' || filterZone === '0') {
        const coords = TUZLA_PARKING_ZONE_POLYGON.polygons[0].map(pt => [pt[1], pt[0]]);
        features.push({
          type: 'Feature',
          properties: {
            color: TUZLA_PARKING_ZONE_POLYGON.color,
            opacity: filterZone === '0' ? 0.45 : 0.25
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coords]
          }
        });
      }

      const source = map.getSource('zone-polygons') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features
        });
      }
    } catch (e) {
      console.warn('Error drawing parking zone polygons', e);
    }
  }, [filterZone]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => (m as maplibregl.Marker).remove());
    markersRef.current = {};

    const filteredLots = parkingLots.filter(
      (lot) => filterZone === 'all' || lot.zone === filterZone
    );

    filteredLots.forEach((lot) => {
      const lat = Number(lot.coordinates?.[0]);
      const lng = Number(lot.coordinates?.[1]);
      if (isNaN(lat) || isNaN(lng)) return;

      const details = ZONE_DETAILS[lot.zone];
      const isSelected = selectedLot?.id === lot.id;

      const el = document.createElement('div');
      el.className = 'custom-map-pin';
      el.innerHTML = `
        <div class="relative group cursor-pointer transform transition-all duration-200 hover:scale-110 ${isSelected ? 'scale-125 z-50' : 'z-10'}">
          <div class="w-8 h-8 rounded-lg bg-[#1a2a44] border-2 flex items-center justify-center shadow-lg" style="border-color: ${details.color}">
            <span class="text-[11px] font-black text-[#d4af37]">Z${lot.zone}</span>
          </div>
          ${isSelected ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] border-2 border-[#0a1128] animate-ping"></div>` : ''}
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] mx-auto -mt-0.5" style="border-t-color: ${details.color}"></div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map);

      const popupHtml = `
        <div class="p-3 bg-[#1a2a44] text-slate-100 font-sans min-w-[220px] max-w-[260px]">
          <div class="flex items-center justify-between mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-[#0a1128]" style="background-color: ${details.color}">
              Zona ${lot.zone}
            </span>
            <span class="text-xs font-black text-[#d4af37]">${lot.hourlyPrice.toFixed(1)} KM/h</span>
          </div>
          <h3 class="font-bold text-sm text-white mb-0.5">${lot.name}</h3>
          <p class="text-[11px] text-slate-300 mb-2">${lot.address}</p>
          <div class="flex gap-1.5 mt-2">
            <button id="pop-sms-${lot.id}" class="flex-1 py-1.5 px-2 rounded-md bg-[#d4af37] hover:bg-[#b8860b] text-[#0a1128] text-[11px] font-bold text-center transition-colors">
              💬 Plati SMS
            </button>
            <button id="pop-nav-${lot.id}" class="flex-1 py-1.5 px-2 rounded-md bg-[#0a1128] hover:bg-slate-800 border border-slate-700 text-slate-100 text-[11px] font-bold text-center transition-colors">
              🧭 Navigacija
            </button>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
        .setHTML(popupHtml);

      popup.on('open', () => {
        const smsBtn = document.getElementById(`pop-sms-${lot.id}`);
        const navBtn = document.getElementById(`pop-nav-${lot.id}`);

        if (smsBtn) {
          smsBtn.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            onPaySms(lot);
          };
        }
        if (navBtn) {
          navBtn.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            onStartNavigation(lot);
          };
        }
      });

      marker.setPopup(popup);

      el.addEventListener('click', () => {
        onSelectLot(lot);
      });

      markersRef.current[lot.id] = marker;
    });
  }, [parkingLots, filterZone, selectedLot]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLot) return;

    const lat = Number(selectedLot.coordinates?.[0]);
    const lng = Number(selectedLot.coordinates?.[1]);
    if (isNaN(lat) || isNaN(lng)) return;

    map.flyTo({
      center: [lng, lat],
      zoom: 17,
      speed: 1.2
    });

    const marker = markersRef.current[selectedLot.id];
    if (marker) {
      marker.togglePopup();
    }
  }, [selectedLot]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation && !isNaN(userLocation.lat) && !isNaN(userLocation.lng)) {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md';

      const userMarker = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);

      userMarkerRef.current = userMarker;
    }
  }, [userLocation]);

  // Toggle 3D perspective when is3D changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.easeTo({
      pitch: is3D ? 60 : 0,
      bearing: is3D ? -30 : 0,
      duration: 800
    });
  }, [is3D]);

  // Update route line - waits for source to be available
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateRoute = () => {
      const source = map.getSource('route') as maplibregl.GeoJSONSource;
      if (!source) return;

      if (activeRoute && Array.isArray(activeRoute.coordinates) && activeRoute.coordinates.length > 0) {
        const validCoords = activeRoute.coordinates
          .filter(c => Array.isArray(c) && c.length >= 2 && !isNaN(c[0]) && !isNaN(c[1]))
          .map(c => [c[1], c[0]] as [number, number]);

        if (validCoords.length > 0) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: validCoords
            }
          });
          const bounds = new maplibregl.LngLatBounds(validCoords[0], validCoords[0]);
          validCoords.forEach(coord => bounds.extend(coord));
          map.fitBounds(bounds, { padding: 50 });
        }
      } else {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] }
        });
      }
    };

    // If the source exists already, update immediately
    if (map.getSource('route')) {
      updateRoute();
    } else {
      // Source not yet added (style still loading) - wait for it
      map.once('load', updateRoute);
    }
  }, [activeRoute]);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] overflow-hidden bg-slate-950" onContextMenu={(e) => e.preventDefault()}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <OfflineMapController map={mapInstance} />

      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 bg-[#061d40]/95 backdrop-blur-md p-1 rounded-full border border-[#d4af37]/40 shadow-xl">
          <button
            onClick={() => onFilterZoneChange('all')}
            className={`px-1.5 py-0.5 rounded-full text-xs font-bold transition-all ${filterZone === 'all'
              ? 'bg-[#d4af37] text-[#041530] shadow-sm font-extrabold'
              : 'text-slate-300 hover:text-white'}`}
          >
            Sve
          </button>
          <button
            onClick={() => onFilterZoneChange('0')}
            className={`px-1.5 py-0.5 rounded-full text-xs font-bold border transition-all ${filterZone === '0'
              ? 'bg-red-500 text-white border-red-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-red-500/40 text-red-400'}`}
          >
            Z0
          </button>
          <button
            onClick={() => onFilterZoneChange('1')}
            className={`px-1.5 py-0.5 rounded-full text-xs font-bold border transition-all ${filterZone === '1'
              ? 'bg-sky-500 text-white border-sky-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-sky-500/40 text-sky-400'}`}
          >
            Z1
          </button>
          <button
            onClick={() => onFilterZoneChange('2')}
            className={`px-1.5 py-0.5 rounded-full text-xs font-bold border transition-all ${filterZone === '2'
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-emerald-500/40 text-emerald-400'}`}
          >
            Z2
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={onRequestUserLocation}
          className="w-12 h-12 rounded-full bg-[#d4af37] text-[#041530] flex items-center justify-center shadow-2xl hover:bg-[#b8860b] transition-transform active:scale-95 border border-[#d4af37]/50"
          title={t.parkingList.locateClosest}
        >
          <Locate className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      <div className="absolute bottom-6 left-3 z-20 pointer-events-auto">
        <div className="bg-[#061d40]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d4af37]/30 text-[11px] text-slate-200 flex items-center gap-2 shadow-lg">
          <span className="w-3 h-3 rounded-full bg-red-500/80 border border-white inline-block"></span>
          <span className="font-semibold text-slate-200">Pannonica / Kojšino Zona 0</span>
        </div>
      </div>
    </div>
  );
};
