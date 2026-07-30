import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Locate, Navigation, MapPin, Layers, Compass, Zap, Shield, Info } from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { ZONE_DETAILS, TUZLA_PARKING_ZONE_POLYGON, ZONA_1_POLYGONS, ZONA_2_POLYGONS } from '../data/parkingData';
import NavigationHUD from '../services/NavigationHUD';
import { calculateRoute } from '../services/routingService';
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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polygonGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const t = TRANSLATIONS[currentLang];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default Tuzla center [Lat, Lng]
    // Load building GeoJSON for Tuzla center and style it (silver shades)
    fetch('/TuzlaTourGuide.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        L.geoJSON(geojson, {
          style: {
            color: '#c0c0c0',
            fillColor: '#e0e0e0',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.5,
          },
        }).addTo(mapInstanceRef.current);
      })
      .catch((e) => console.warn('Failed to load TuzlaTourGuide.geojson', e));
    const defaultCenter: [number, number] = [44.538, 18.675];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      minZoom: 13,
      maxZoom: 20,
      zoomControl: false,
    });

    // Geoapify tile layer with fallback to OSM
    const geoapifyKey = 'ed861a6e59dc4d4689957789386559ae';
    const primaryTileUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`;
    const fallbackTileUrl = '/tile/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(primaryTileUrl, {
      attribution: '&copy; OpenStreetMap contributors & Geoapify',
      maxZoom: 18,
    });

    tileLayer.on('tileerror', () => {
      tileLayer.setUrl(fallbackTileUrl);
    });

    tileLayer.addTo(map);
    mapInstanceRef.current = map;

    // Clean up
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Polygon Overlays for Zona 0, Zona 1 (Light Blue) and Zona 2 (Green)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polygonGroupRef.current) {
      polygonGroupRef.current.clearLayers();
      map.removeLayer(polygonGroupRef.current);
      polygonGroupRef.current = null;
    }

    const group = L.layerGroup();

    try {
      // 1. Zona 0 / Special Zone Polygon (Red accent)
      if (filterZone === 'all' || filterZone === '0') {
        const rawPolyCoords0 = TUZLA_PARKING_ZONE_POLYGON.polygons[0];
        const leafletCoords0: [number, number][] = rawPolyCoords0
          .filter((pt) => Array.isArray(pt) && typeof pt[0] === 'number' && typeof pt[1] === 'number' && !isNaN(pt[0]) && !isNaN(pt[1]))
          .map((pt) => [pt[1], pt[0]]);
        if (leafletCoords0.length > 2) {
          const poly0 = L.polygon(leafletCoords0, {
            color: TUZLA_PARKING_ZONE_POLYGON.color,
            fillColor: TUZLA_PARKING_ZONE_POLYGON.color,
            fillOpacity: filterZone === '0' ? 0.45 : 0.25,
            weight: 2,
            dashArray: '4, 4',
          });
          poly0.bindTooltip('Zona 0 • Centar / Pannonica', {
            direction: 'center',
            className: 'custom-polygon-tooltip',
          });
          group.addLayer(poly0);
        }
      }



      group.addTo(map);
      polygonGroupRef.current = group;
    } catch (e) {
      console.warn('Error drawing parking zone polygons', e);
    }
  }, [filterZone]);

  // Update Markers when parkingLots or filterZone changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: L.Marker) => m.remove());
    markersRef.current = {};

    const filteredLots = parkingLots.filter(
      (lot) => filterZone === 'all' || lot.zone === filterZone
    );

    filteredLots.forEach((lot) => {
      // lot.coordinates is [lat, lng]
      const lat = Number(lot.coordinates?.[0]);
      const lng = Number(lot.coordinates?.[1]);
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      const details = ZONE_DETAILS[lot.zone];
      const isSelected = selectedLot?.id === lot.id;

      // Custom div icon with Professional Polish styling (#0a1128, #1a2a44, #d4af37)
      const iconHtml = `
        <div class="relative group cursor-pointer transform transition-all duration-200 hover:scale-110 ${isSelected ? 'scale-125 z-50' : 'z-10'
        }">
          <div class="w-8 h-8 rounded-lg bg-[#1a2a44] border-2 flex items-center justify-center shadow-lg"
               style="border-color: ${details.color}">
            <span class="text-[11px] font-black text-[#d4af37]">Z${lot.zone}</span>
          </div>
          ${isSelected
          ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] border-2 border-[#0a1128] animate-ping"></div>`
          : ''
        }
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] mx-auto -mt-0.5"
               style="border-t-color: ${details.color}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-pin',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content
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

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup',
        closeButton: true,
      });

      marker.on('click', () => {
        onSelectLot(lot);
      });

      marker.on('popupopen', (e: any) => {
        const popupEl = e.popup?.getElement();
        const smsBtn = popupEl?.querySelector(`#pop-sms-${lot.id}`) || document.getElementById(`pop-sms-${lot.id}`);
        const navBtn = popupEl?.querySelector(`#pop-nav-${lot.id}`) || document.getElementById(`pop-nav-${lot.id}`);

        if (smsBtn) {
          smsBtn.onclick = (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
            onPaySms(lot);
          };
        }
        if (navBtn) {
          navBtn.onclick = async (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
            // Get user location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(async (pos) => {
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;
                // Fly to user location and apply tilt
                const map = mapInstanceRef.current;
                if (map) {
                  map.flyTo([userLat, userLng], 15, { duration: 1 });
                  const container = map.getContainer();
                  container.classList.add('map-tilt');
                }
                // Calculate route
                const route = await calculateRoute({ lat: userLat, lng: userLng }, lot);
                setNavRoute(route);
              });
            } else {
              // Fallback without geolocation
              const route = await calculateRoute({ lat: 0, lng: 0 }, lot);
              setNavRoute(route);
            }
          };
        }
      });

      markersRef.current[lot.id] = marker;
    });
  }, [parkingLots, filterZone, selectedLot]);

  // Navigation route state and HUD
  const [navRoute, setNavRoute] = useState<NavigationRoute | null>(null);
  const handleCloseHUD = () => setNavRoute(null);

  // Center or FlyTo Selected Lot
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLot) return;

    const lat = Number(selectedLot.coordinates?.[0]);
    const lng = Number(selectedLot.coordinates?.[1]);
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

    map.flyTo([lat, lng], 17, {
      duration: 1.2,
    });

    const marker = markersRef.current[selectedLot.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedLot]);

  // Render User Location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (
      userLocation &&
      typeof userLocation.lat === 'number' &&
      typeof userLocation.lng === 'number' &&
      !isNaN(userLocation.lat) &&
      !isNaN(userLocation.lng)
    ) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: '#3B82F6',
        color: '#FFFFFF',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      userMarker.bindTooltip('Vaša Lokacija', { permanent: false, direction: 'top' });
      userMarkerRef.current = userMarker;
    }
  }, [userLocation]);

  // Render Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (activeRoute && Array.isArray(activeRoute.coordinates) && activeRoute.coordinates.length > 0) {
      const validCoords = activeRoute.coordinates.filter(
        (c) => Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1])
      );

      if (validCoords.length > 0) {
        const polyline = L.polyline(validCoords, {
          color: '#D4AF37',
          weight: 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        try {
          const bounds = polyline.getBounds();
          if (bounds && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
          } else if (validCoords[0]) {
            map.panTo(validCoords[0]);
          }
        } catch (e) {
          console.warn('fitBounds error ignored', e);
        }

        routePolylineRef.current = polyline;
      }
    }
  }, [activeRoute]);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] overflow-hidden bg-slate-950">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Zone Filters Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 bg-[#061d40]/95 backdrop-blur-md p-1 rounded-full border border-[#d4af37]/40 shadow-xl">
          <button
            onClick={() => onFilterZoneChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterZone === 'all'
              ? 'bg-[#d4af37] text-[#041530] shadow-sm font-extrabold'
              : 'text-slate-300 hover:text-white'
              }`}
          >
            Sve
          </button>
          <button
            onClick={() => onFilterZoneChange('0')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${filterZone === '0'
              ? 'bg-red-500 text-white border-red-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-red-500/40 text-red-400'
              }`}
          >
            Z0 (Crvena)
          </button>
          <button
            onClick={() => onFilterZoneChange('1')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${filterZone === '1'
              ? 'bg-sky-500 text-white border-sky-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-sky-500/40 text-sky-400'
              }`}
          >
            Z1 (Plava)
          </button>
          <button
            onClick={() => onFilterZoneChange('2')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${filterZone === '2'
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm font-extrabold'
              : 'bg-[#041530] border-emerald-500/40 text-emerald-400'
              }`}
          >
            Z2 (Zelena)
          </button>
        </div>
      </div>

      {/* Floating Action Buttons: Locate Me */}
      <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={onRequestUserLocation}
          className="w-12 h-12 rounded-full bg-[#d4af37] text-[#041530] flex items-center justify-center shadow-2xl hover:bg-[#b8860b] transition-transform active:scale-95 border border-[#d4af37]/50"
          title={t.parkingList.locateClosest}
        >
          <Locate className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* Polygon Legend Banner */}
      <div className="absolute bottom-6 left-3 z-20 pointer-events-auto">
        <div className="bg-[#061d40]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d4af37]/30 text-[11px] text-slate-200 flex items-center gap-2 shadow-lg">
          <span className="w-3 h-3 rounded-full bg-red-500/80 border border-white inline-block"></span>
          <span className="font-semibold text-slate-200">Pannonica / Kojšino Zona 0</span>
        </div>
      </div>
    </div>
  );
};
