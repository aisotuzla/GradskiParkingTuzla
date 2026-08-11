import React, { useState, useEffect } from 'react';
import { Map, List, MessageSquare, Clock, Car } from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData, ParkingPaymentSession, ParkingZone, UserLocation } from './types';
import { TUZLA_PARKING_DATA } from './data/parkingData';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { ParkingList } from './components/ParkingList';
import { SmsPaymentModal } from './components/SmsPaymentModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { ActiveTimerWidget } from './components/ActiveTimerWidget';
import { VehicleManager } from './components/VehicleManager';
import { getActiveSession, saveActiveSession } from './services/smsService';
import { calculateRoute, generateOfflineRoute } from './services/routingService';


// Center of Tuzla city coordinates (Trg slobode / Centar)
const TUZLA_CENTER: UserLocation = { lat: 44.5385, lng: 18.6770 };

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('bs');
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'pay' | 'timer' | 'vehicle'>('map');
  const [filterZone, setFilterZone] = useState<ParkingZone | 'all'>('all');
  const [selectedLot, setSelectedLot] = useState<ParkingLotData | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeSession, setActiveSession] = useState<ParkingPaymentSession | null>(getActiveSession());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  // Voice modal state removed

  const notified10MinRef = React.useRef<boolean>(false);
  const notifiedExpiredRef = React.useRef<boolean>(false);

  const t = TRANSLATIONS[currentLang];

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Auto request user location on app launch
  useEffect(() => {
    handleRequestLocation();
  }, []);

  // Periodically check active timer session expiry and notify user
  useEffect(() => {
    const interval = setInterval(() => {
      const session = getActiveSession();
      setActiveSession(session);

      if (session) {
        const remainingMs = session.endTime - Date.now();

        // 10 minute warning notification
        if (remainingMs > 0 && remainingMs <= 10 * 60 * 1000 && !notified10MinRef.current) {
          notified10MinRef.current = true;

          // Native Web Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('Tuzla Parking — Tajmer Ističe!', {
                body: `PAŽNJA: Vaš parking za vozilo ${session.licensePlate} ističe za manje od 10 minuta!`,
                dir: 'auto',
              });
            } catch (e) {
              console.warn('Notification error:', e);
            }
          }
        }

        // Expiration notification
        if (remainingMs <= 0 && !notifiedExpiredRef.current) {
          notifiedExpiredRef.current = true;

          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('Tuzla Parking — Parking Istekao!', {
                body: `Vaš parking za vozilo ${session.licensePlate} je upravo istekao!`,
                dir: 'auto',
              });
            } catch (e) {
              console.warn('Notification error:', e);
            }
          }
        }
      } else {
        notified10MinRef.current = false;
        notifiedExpiredRef.current = false;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentLang]);

  const handleInstallPwa = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        setDeferredInstallPrompt(null);
      });
    }
  };

  const handleRequestLocation = async (): Promise<UserLocation | null> => {
    if ('geolocation' in navigator) {
      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
          const rawLat = position?.coords?.latitude;
          const rawLng = position?.coords?.longitude;

          if (
            typeof rawLat === 'number' &&
            typeof rawLng === 'number' &&
            !isNaN(rawLat) &&
            !isNaN(rawLng) &&
            isFinite(rawLat) &&
            isFinite(rawLng)
          ) {
            const loc: UserLocation = {
              lat: rawLat,
              lng: rawLng,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
            };
            setUserLocation(loc);
            resolve(loc);
          } else {
            setUserLocation(TUZLA_CENTER);
            resolve(TUZLA_CENTER);
          }
          },
          (error) => {
            console.warn('Geolocation access error, using Tuzla city center fallback', error);
            setUserLocation(TUZLA_CENTER);
            resolve(TUZLA_CENTER);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      });
    } else {
      setUserLocation(TUZLA_CENTER);
      return TUZLA_CENTER;
    }
  };

  const handleStartNavigation = async (lot: ParkingLotData) => {
    setSelectedLot(lot);
    // Use user GPS location if available, otherwise default fallback to Tuzla city center
    const startLoc = userLocation || TUZLA_CENTER;

    // Immediately open navigation mode and draw route on map
    const instantRoute = generateOfflineRoute(startLoc, lot);
    setActiveRoute(instantRoute);
    setActiveTab('map');

    if (navigator.onLine) {
      try {
        const onlineRoute = await calculateRoute(startLoc, lot);
        if (onlineRoute && !onlineRoute.isOffline) {
          setActiveRoute(onlineRoute);
        }
      } catch (err) {
        console.warn('Online route refinement error:', err);
      }
    }
  };

  const handleOpenSmsPay = (lot?: ParkingLotData) => {
    if (lot) {
      setSelectedLot(lot);
    }
    setIsPayModalOpen(true);
  };

  const handleSessionStarted = (session: ParkingPaymentSession) => {
    setActiveSession(session);
    setIsPayModalOpen(false);
  };

  const handleClearSession = () => {
    saveActiveSession(null);
    setActiveSession(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0a142f] text-slate-100 flex flex-col font-sans select-none antialiased overflow-hidden">
      {/* Top Smartphone Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOnline={isOnline}
        deferredInstallPrompt={deferredInstallPrompt}
        onInstallPwa={handleInstallPwa}
        activeTimerCount={activeSession && activeSession.endTime > Date.now() ? 1 : 0}
        onOpenTimer={() => setActiveTab('timer')}
        // Voice feature removed
      />

      {/* Main Screen Body */}
      <main className="flex-1 relative overflow-hidden flex flex-col pb-14">
        {activeRoute ? (
          /* Split Screen Navigation View: Upper 50% Map, Bottom 50% Navigation Drawer */
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Upper 50% of screen: Map and Routing Line */}
            <div className="h-1/2 w-full relative">
              <MapView
                parkingLots={TUZLA_PARKING_DATA}
                selectedLot={selectedLot}
                onSelectLot={(lot) => setSelectedLot(lot)}
                onPaySms={handleOpenSmsPay}
                onStartNavigation={handleStartNavigation}
                userLocation={userLocation}
                onRequestUserLocation={handleRequestLocation}
                activeRoute={activeRoute}
                currentLang={currentLang}
                filterZone={filterZone}
                onFilterZoneChange={setFilterZone}
              />
            </div>

            {/* Bottom 50% of screen: Solid Blue Navigation Box, Golden Title, White Text */}
            <div className="h-1/2 w-full bg-gradient-to-b from-[#1d4ed8]/95 via-[#1e3a8a]/95 to-[#0a142f]/98 backdrop-blur-xl border-t-2 border-[#d4af37]/60 text-white z-30 opacity-100 overflow-hidden flex flex-col shadow-2xl">
              <NavigationDrawer
                route={activeRoute}
                onStopNavigation={() => setActiveRoute(null)}
                onPaySmsForLot={handleOpenSmsPay}
                currentLang={currentLang}
              />
            </div>
          </div>
        ) : (
          /* Normal Tab Screen Views */
          <div className="w-full h-full overflow-y-auto">
            {activeTab === 'map' && (
              <MapView
                parkingLots={TUZLA_PARKING_DATA}
                selectedLot={selectedLot}
                onSelectLot={(lot) => setSelectedLot(lot)}
                onPaySms={handleOpenSmsPay}
                onStartNavigation={handleStartNavigation}
                userLocation={userLocation}
                onRequestUserLocation={handleRequestLocation}
                activeRoute={activeRoute}
                currentLang={currentLang}
                filterZone={filterZone}
                onFilterZoneChange={setFilterZone}
              />
            )}

            {activeTab === 'list' && (
              <ParkingList
                parkingLots={TUZLA_PARKING_DATA}
                selectedLot={selectedLot}
                onSelectLot={(lot) => {
                  setSelectedLot(lot);
                  setActiveTab('map');
                }}
                onPaySms={handleOpenSmsPay}
                onStartNavigation={handleStartNavigation}
                userLocation={userLocation}
                onRequestUserLocation={handleRequestLocation}
                currentLang={currentLang}
              />
            )}

            {activeTab === 'pay' && (
              <div className="p-4 max-w-md mx-auto">
                <button
                  onClick={() => handleOpenSmsPay(selectedLot || TUZLA_PARKING_DATA[0])}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#0a1128] font-black text-base flex items-center justify-center gap-2 shadow-xl hover:brightness-105 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Otvori SMS Plaćanje ({selectedLot ? selectedLot.name : 'Zona 0/1/2'})</span>
                </button>
              </div>
            )}

            {activeTab === 'timer' && (
              <ActiveTimerWidget
                session={activeSession}
                onClearSession={handleClearSession}
                onExtendSession={() => handleOpenSmsPay(selectedLot || undefined)}
                currentLang={currentLang}
              />
            )}

            {activeTab === 'vehicle' && <VehicleManager currentLang={currentLang} />}
          </div>
        )}
      </main>

      {/* SMS Payment Modal Drawer */}
      <SmsPaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        selectedLot={selectedLot}
        onSessionStarted={handleSessionStarted}
        currentLang={currentLang}
      />

      {/* Fixed Smartphone Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#1d4ed8]/95 via-[#1e3a8a]/95 to-[#0a142f]/98 backdrop-blur-xl border-t border-[#d4af37]/30 px-3 py-2 shadow-2xl h-14">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          {/* Map Tab */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${activeTab === 'map'
              ? 'text-[#d4af37] font-bold bg-[#0c2340]/90 border border-[#d4af37]/50 shadow-lg backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Map className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.map}</span>
          </button>

          {/* List Tab */}
          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${activeTab === 'list'
              ? 'text-[#d4af37] font-bold bg-[#0c2340]/90 border border-[#d4af37]/50 shadow-lg backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <List className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.list}</span>
          </button>

          {/* SMS Pay Direct Tab */}
          <button
            onClick={() => {
              const payLot = selectedLot || TUZLA_PARKING_DATA[0];
              handleOpenSmsPay(payLot);
            }}
            className="flex flex-col items-center justify-center py-1 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-[#040c1a] font-black shadow-lg shadow-[#d4af37]/25 active:scale-95 transition-all -mt-3 border-2 border-[#0e2a52]"
          >
            <MessageSquare className="w-5 h-5 mb-0.5 fill-current" />
            <span className="text-[9px] uppercase font-black leading-none">{t.tabs.pay}</span>
          </button>

          {/* Timer Tab */}
          <button
            onClick={() => setActiveTab('timer')}
            className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${activeTab === 'timer'
              ? 'text-[#d4af37] font-bold bg-[#0c2340]/90 border border-[#d4af37]/50 shadow-lg backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.timer}</span>
            {activeSession && activeSession.endTime > Date.now() && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#d4af37] animate-ping"></span>
            )}
          </button>

          {/* Vehicle Tab */}
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${activeTab === 'vehicle'
              ? 'text-[#d4af37] font-bold bg-[#0c2340]/90 border border-[#d4af37]/50 shadow-lg backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Car className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.vehicle}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
