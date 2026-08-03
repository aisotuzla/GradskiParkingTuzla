import { NavigationRoute, ParkingLotData, RouteStep, UserLocation } from '../types';
import { TUZLA_OFFLINE_ROAD_NODES } from '../data/parkingData';

export const GEOAPIFY_API_KEY = '4b59ef066c8947618d81a98bc78622ab';

// Haversine distance in meters
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' || isNaN(lat1) ||
    typeof lon1 !== 'number' || isNaN(lon1) ||
    typeof lat2 !== 'number' || isNaN(lat2) ||
    typeof lon2 !== 'number' || isNaN(lon2)
  ) {
    return 0;
  }
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) {
    return `${mins} min`;
  }
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}

export async function calculateRoute(
  startLoc: UserLocation,
  targetLot: ParkingLotData
): Promise<NavigationRoute> {
  const safeStartLat = typeof startLoc?.lat === 'number' && !isNaN(startLoc.lat) ? startLoc.lat : 44.538;
  const safeStartLng = typeof startLoc?.lng === 'number' && !isNaN(startLoc.lng) ? startLoc.lng : 18.675;
  const rawDestLng = targetLot?.coordinates?.[1];
  const rawDestLat = targetLot?.coordinates?.[0];
  const destLat = typeof rawDestLat === 'number' && !isNaN(rawDestLat) ? rawDestLat : 44.538;
  const destLng = typeof rawDestLng === 'number' && !isNaN(rawDestLng) ? rawDestLng : 18.675;

  const safeStartLoc: UserLocation = { ...startLoc, lat: safeStartLat, lng: safeStartLng };
  const isOnline = navigator.onLine;

  if (isOnline) {
    try {
      const url = `https://api.geoapify.com/v1/routing?waypoints=${safeStartLat},${safeStartLng}|${destLat},${destLng}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const properties = feature.properties;
          const geometry = feature.geometry;

          // Convert GeoJSON [lng, lat] coordinates to MapLibre [lat, lng]
          const coords: [number, number][] = (geometry.coordinates[0] || [])
            .map((c: number[]) => [Number(c[1]), Number(c[0])] as [number, number])
            .filter((c: [number, number]) => typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1]));

          const steps: RouteStep[] = [];
          if (properties.legs && properties.legs[0] && properties.legs[0].steps) {
            properties.legs[0].steps.forEach((s: any) => {
              steps.push({
                instruction: s.instruction ? s.instruction.text : 'Nastavite vožnju',
                distance: Math.round(s.distance || 0),
                time: Math.round(s.time || 0),
                action: parseActionType(s.instruction ? s.instruction.text : ''),
              });
            });
          }

          if (steps.length === 0) {
            steps.push({
              instruction: `Vozite prema ${targetLot.name}, ${targetLot.address}`,
              distance: Math.round(properties.distance || 0),
              time: Math.round(properties.time || 0),
              action: 'straight',
            });
          }

          const onlineRoute: NavigationRoute = {
            distance: Math.round(properties.distance || 0),
            duration: Math.round(properties.time || 0),
            coordinates: coords,
            steps,
            isOffline: false,
            targetLot,
          };

          // Cache last successful route
          try {
            localStorage.setItem(
              `tuzla_route_cache_${targetLot.id}`,
              JSON.stringify(onlineRoute)
            );
          } catch (e) {
            console.warn('Cache write failed', e);
          }

          return onlineRoute;
        }
      }
    } catch (err) {
      console.warn('Geoapify online routing fetch failed, falling back to offline route', err);
    }
  }

  // Fallback to Offline Navigation Corridor algorithm
  return generateOfflineRoute(safeStartLoc, targetLot);
}

function parseActionType(
  instruction: string
): 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'u-turn' | 'arrive' {
  const lower = instruction.toLowerCase();
  if (lower.includes('left') || lower.includes('lijevo')) return 'turn-left';
  if (lower.includes('right') || lower.includes('desno')) return 'turn-right';
  if (lower.includes('arrive') || lower.includes('stigli')) return 'arrive';
  return 'straight';
}

export function generateOfflineRoute(
  startLoc: UserLocation,
  targetLot: ParkingLotData
): NavigationRoute {
  const safeStartLat = typeof startLoc?.lat === 'number' && !isNaN(startLoc.lat) ? startLoc.lat : 44.538;
  const safeStartLng = typeof startLoc?.lng === 'number' && !isNaN(startLoc.lng) ? startLoc.lng : 18.675;
  const rawDestLng = targetLot?.coordinates?.[1];
  const rawDestLat = targetLot?.coordinates?.[0];
  const destLat = typeof rawDestLat === 'number' && !isNaN(rawDestLat) ? rawDestLat : 44.538;
  const destLng = typeof rawDestLng === 'number' && !isNaN(rawDestLng) ? rawDestLng : 18.675;

  // Check if we have a cached route in localStorage first
  try {
    const cached = localStorage.getItem(`tuzla_route_cache_${targetLot.id}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.coordinates) && parsed.coordinates.length > 0) {
        const validCachedCoords = parsed.coordinates.filter(
          (c: any) => Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1])
        );
        if (validCachedCoords.length > 0) {
          return { ...parsed, coordinates: validCachedCoords, isOffline: true };
        }
      }
    }
  } catch (e) {
    console.warn('Cache read failed', e);
  }

  // Find nearest road nodes from offline graph
  const waypoints: [number, number][] = [[safeStartLat, safeStartLng]];

  // Sort offline road nodes by distance to start, then to destination
  const intermediateNodes = [...TUZLA_OFFLINE_ROAD_NODES]
    .filter((node) => Array.isArray(node) && typeof node[0] === 'number' && typeof node[1] === 'number' && !isNaN(node[0]) && !isNaN(node[1]))
    .map((node) => {
      const distFromStart = calculateDistanceMeters(safeStartLat, safeStartLng, node[0], node[1]);
      const distToDest = calculateDistanceMeters(node[0], node[1], destLat, destLng);
      return { node, distFromStart, distToDest, total: distFromStart + distToDest };
    })
    .sort((a, b) => a.total - b.total);

  // Take top 2 intermediate road corridor nodes
  if (intermediateNodes.length > 0) {
    waypoints.push(intermediateNodes[0].node);
    if (intermediateNodes.length > 1 && intermediateNodes[1].total < intermediateNodes[0].total * 1.3) {
      waypoints.push(intermediateNodes[1].node);
    }
  }
  waypoints.push([destLat, destLng]);

  // Interpolate smooth path
  const fullPath: [number, number][] = [];
  let totalDistance = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const legDist = calculateDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
    totalDistance += legDist;

    // Add steps along segment
    const stepsCount = Math.max(3, Math.floor(legDist / 150));
    for (let s = 0; s <= stepsCount; s++) {
      const t = s / stepsCount;
      const lat = p1[0] + (p2[0] - p1[0]) * t;
      const lng = p1[1] + (p2[1] - p1[1]) * t;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        fullPath.push([lat, lng]);
      }
    }
  }

  // Average driving speed in Tuzla city center ~ 32 km/h (8.8 m/s)
  const estDuration = Math.round(totalDistance / 8.8);

  const steps: RouteStep[] = [
    {
      instruction: `Krenite od trenutne lokacije prema glavnoj saobraćajnici.`,
      distance: Math.round(totalDistance * 0.2),
      time: Math.round(estDuration * 0.2),
      action: 'straight',
    },
    {
      instruction: `Pratite koridor saobraćajnice prema području ${targetLot.area}.`,
      distance: Math.round(totalDistance * 0.6),
      time: Math.round(estDuration * 0.6),
      action: 'straight',
    },
    {
      instruction: `Skrenite prema ${targetLot.address}.`,
      distance: Math.round(totalDistance * 0.2),
      time: Math.round(estDuration * 0.2),
      action: 'turn-right',
    },
    {
      instruction: `Stigli ste na ${targetLot.name}!`,
      distance: 0,
      time: 0,
      action: 'arrive',
    },
  ];

  return {
    distance: totalDistance,
    duration: estDuration,
    coordinates: fullPath,
    steps,
    isOffline: true,
    targetLot,
  };
}
