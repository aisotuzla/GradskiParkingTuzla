import { ParkingPaymentSession, ParkingZone } from '../types';
import { ZONE_DETAILS, getSmsNumber } from '../data/parkingData';

const LOCAL_STORAGE_ACTIVE_SESSION_KEY = 'tuzla_active_parking_v1';
const LOCAL_STORAGE_PLATES_KEY = 'tuzla_saved_plates_v1';
const LOCAL_STORAGE_HISTORY_KEY = 'tuzla_payment_history_v1';

export function sanitizePlate(plate: string): string {
  // Removes spaces and hyphens for SMS transmission while keeping alphanumeric uppercase
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function formatPlateDisplay(plate: string): string {
  const clean = sanitizePlate(plate);
  if (clean.length === 7) {
    // Format e.g. A12-E-345 or M12-K-345
    return `${clean.slice(0, 3)}-${clean.slice(3, 4)}-${clean.slice(4)}`;
  }
  return clean;
}

export function generateSmsUri(phone: string, bodyText: string): string {
  const encodedBody = encodeURIComponent(bodyText);
  // Universal SMS link scheme for modern iOS / Android webviews
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isiOS) {
    return `sms:${phone}&body=${encodedBody}`;
  }
  return `sms:${phone}?body=${encodedBody}`;
}

export function getSavedPlates(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLATES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn('Could not read saved plates', e);
  }
  return ['E12-M-345', 'A12-K-890'];
}

export function savePlate(plate: string): void {
  const formatted = formatPlateDisplay(plate);
  if (!formatted) return;
  const current = getSavedPlates();
  const updated = [formatted, ...current.filter((p) => p !== formatted)].slice(0, 5);
  try {
    localStorage.setItem(LOCAL_STORAGE_PLATES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save plate', e);
  }
}

export function calculateParkingCost(zone: ParkingZone, hours: number, isDayTicket: boolean): number {
  const details = ZONE_DETAILS[zone];
  if (isDayTicket) {
    return details.dailyPrice;
  }
  return details.hourlyPrice * hours;
}

export function createPaymentSession(
  zone: ParkingZone,
  rawPlate: string,
  hours: number,
  isDayTicket: boolean,
  parkingId?: string,
  parkingName?: string
): ParkingPaymentSession {
  const cleanPlate = sanitizePlate(rawPlate);
  const details = ZONE_DETAILS[zone];
  const totalPrice = calculateParkingCost(zone, hours, isDayTicket);
  const startTime = Date.now();
  
  // Calculate expiration duration in ms
  const durationMs = isDayTicket ? 24 * 60 * 60 * 1000 : hours * 60 * 60 * 1000;
  const endTime = startTime + durationMs;

  const session: ParkingPaymentSession = {
    id: `pay_${Date.now()}`,
    parkingId,
    parkingName: parkingName || details.name,
    zone,
    licensePlate: cleanPlate,
    hours: isDayTicket ? 24 : hours,
    isDayTicket,
    totalPrice,
    startTime,
    endTime,
    smsNumber: getSmsNumber(zone, isDayTicket),
    smsBody: cleanPlate,
    active: true,
  };

  savePlate(rawPlate);
  saveActiveSession(session);
  addPaymentToHistory(session);
  return session;
}

export function getPaymentHistory(): ParkingPaymentSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (e) {
    console.warn('Error reading payment history', e);
  }

  // Seed default history items for initial view stats
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const initialHistory: ParkingPaymentSession[] = [
    {
      id: `hist_1`,
      parkingName: 'Parking Korzo (Trg Slobode)',
      zone: '0',
      licensePlate: 'E12M345',
      hours: 2,
      isDayTicket: false,
      totalPrice: 2.0,
      startTime: now - 3 * 60 * 60 * 1000,
      endTime: now - 1 * 60 * 60 * 1000,
      smsNumber: '0837501',
      smsBody: 'E12M345',
      active: false,
    },
    {
      id: `hist_2`,
      parkingName: 'Parking Soni Trg',
      zone: '0',
      licensePlate: 'E12M345',
      hours: 1,
      isDayTicket: false,
      totalPrice: 1.0,
      startTime: now - dayMs * 1 - 2 * 60 * 60 * 1000,
      endTime: now - dayMs * 1 - 1 * 60 * 60 * 1000,
      smsNumber: '0837501',
      smsBody: 'E12M345',
      active: false,
    },
    {
      id: `hist_3`,
      parkingName: 'Parking Dom Zdravlja',
      zone: '1',
      licensePlate: 'A12K890',
      hours: 2,
      isDayTicket: false,
      totalPrice: 1.0,
      startTime: now - dayMs * 3 - 4 * 60 * 60 * 1000,
      endTime: now - dayMs * 3 - 2 * 60 * 60 * 1000,
      smsNumber: '0837502',
      smsBody: 'A12K890',
      active: false,
    },
    {
      id: `hist_4`,
      parkingName: 'Parking Panonska Jezera',
      zone: '1',
      licensePlate: 'E12M345',
      hours: 24,
      isDayTicket: true,
      totalPrice: 4.0,
      startTime: now - dayMs * 7 - 6 * 60 * 60 * 1000,
      endTime: now - dayMs * 6 - 6 * 60 * 60 * 1000,
      smsNumber: '0837502',
      smsBody: 'E12M345',
      active: false,
    },
  ];

  try {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(initialHistory));
  } catch (e) {
    console.warn('Failed seeding payment history', e);
  }
  return initialHistory;
}

export function addPaymentToHistory(session: ParkingPaymentSession): void {
  try {
    const current = getPaymentHistory();
    // Avoid duplicate IDs
    const filtered = current.filter((item) => item.id !== session.id);
    const updated = [session, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to add payment to history', e);
  }
}

export function clearPaymentHistory(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear payment history', e);
  }
}

export function getPaymentStats(history: ParkingPaymentSession[]) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let dayTotal = 0;
  let monthTotal = 0;
  let totalSpent = 0;

  history.forEach((session) => {
    const sessionDate = new Date(session.startTime);
    const price = typeof session.totalPrice === 'number' ? session.totalPrice : 0;

    totalSpent += price;

    if (
      sessionDate.getDate() === currentDay &&
      sessionDate.getMonth() === currentMonth &&
      sessionDate.getFullYear() === currentYear
    ) {
      dayTotal += price;
    }

    if (
      sessionDate.getMonth() === currentMonth &&
      sessionDate.getFullYear() === currentYear
    ) {
      monthTotal += price;
    }
  });

  return {
    dayTotal,
    monthTotal,
    totalSpent,
    totalCount: history.length,
  };
}

export function saveActiveSession(session: ParkingPaymentSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_SESSION_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.warn('Error saving active parking session', e);
  }
}

export function getActiveSession(): ParkingPaymentSession | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVE_SESSION_KEY);
    if (raw) {
      const parsed: ParkingPaymentSession = JSON.parse(raw);
      if (parsed.endTime > Date.now()) {
        return parsed;
      } else {
        // Expired session
        localStorage.removeItem(LOCAL_STORAGE_ACTIVE_SESSION_KEY);
      }
    }
  } catch (e) {
    console.warn('Error getting active parking session', e);
  }
  return null;
}

export function isWorkingHoursNow(): boolean {
  const now = new Date();
  const hour = now.getHours();
  // Working hours 07:00h - 22:00h
  return hour >= 7 && hour < 22;
}

export function getTimeUntilWorkingHoursEnd(): string {
  const now = new Date();
  const target = new Date();
  target.setHours(22, 0, 0, 0);

  if (now.getHours() >= 22) {
    return '00h 00m';
  }

  const diffMs = target.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}
