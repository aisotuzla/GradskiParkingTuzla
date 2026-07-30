export type ParkingZone = '0' | '1' | '2';

export type Language = 'bs' | 'en' | 'de';

export interface ParkingLotData {
  id: string;
  name: string;
  area: string;
  address: string;
  coordinates: [number, number]; // [lng, lat] as provided in raw data
  features: string[];
  zone: ParkingZone;
  hourlyPrice: number;
  dailyPrice: number;
  capacity?: number;
  isGarage?: boolean;
}

export interface ZoneDetails {
  zone: ParkingZone;
  name: string;
  hourlyPrice: number;
  dailyPrice: number;
  shortCode: string;
  hourlyShortCode: string;
  dailyShortCode: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface ParkingPaymentSession {
  id: string;
  parkingId?: string;
  parkingName?: string;
  zone: ParkingZone;
  licensePlate: string;
  hours: number;
  isDayTicket: boolean;
  totalPrice: number;
  startTime: number;
  endTime: number;
  smsNumber: string;
  smsBody: string;
  active: boolean;
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  time: number; // in seconds
  action?: 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'u-turn' | 'arrive';
}

export interface NavigationRoute {
  distance: number; // total meters
  duration: number; // total seconds
  coordinates: [number, number][]; // [lat, lng] path
  steps: RouteStep[];
  isOffline: boolean;
  targetLot: ParkingLotData;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}
