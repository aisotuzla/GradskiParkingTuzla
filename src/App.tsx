import React, { useState, useEffect } from 'react';
import { Map, List, MessageSquare, Clock, Car, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData, ParkingPaymentSession, ParkingZone, UserLocation } from './types';
import { TUZLA_PARKING_DATA, ZONE_DETAILS } from './data/parkingData';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { ParkingList } from './components/ParkingList';
import { SmsPaymentModal } from './components/SmsPaymentModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { ActiveTimerWidget } from './components/ActiveTimerWidget';
import { VehicleManager } from './components/VehicleManager';
import { VoiceAssistant } from './components/VoiceAssistant';
import { getActiveSession, saveActiveSession } from './services/smsService';
import { calculateRoute, calculateDistanceMeters, generateOfflineRoute } from './services/routingService';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('bs');
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'pay' | 'timer' | 'vehicle'>('map');
  const [filterZone, setFilterZone] = useState<ParkingZone | 'all'>('all');
  const [selectedLot, setSelectedLot] = useState<ParkingLotData | null>(TUZLA_PARKING_DATA[2]); // Default Skver
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeSession, setActiveSession] = useState<ParkingPaymentSession | null>(getActiveSession());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

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

  // Auto request location on load
  useEffect(() => {
    handleRequestLocation();
  }, []);

  // Periodically check active timer session expiry
  useEffect(() => {
    const interval = setInterval(() => {
      const session = getActiveSession();
      setActiveSession(session);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInstallPwa = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        setDeferredInstallPrompt(null);
      });
    }
  };

  const handleRequestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const rawLat = position.coords.latitude;
          const rawLng = position.coords.longitude;

          if (typeof rawLat === 'number' && typeof rawLng === 'number' && !isNaN(rawLat) && !isNaN(rawLng)) {
            const loc: UserLocation = {
              lat: rawLat,
              lng: rawLng,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
            };
            setUserLocation(loc);

            // Find closest parking lot and auto select
            let closest: ParkingLotData | null = null;
            let minDistance = Infinity;

            TUZLA_PARKING_DATA.forEach((lot) => {
              const dist = calculateDistanceMeters(loc.lat, loc.lng, lot.coordinates[1], lot.coordinates[0]);
              if (dist < minDistance) {
                minDistance = dist;
                closest = lot;
              }
            });

            if (closest) {
              setSelectedLot(closest);
            }
          } else {
            setUserLocation({ lat: 44.538, lng: 18.675 });
          }
        },
        (error) => {
          console.warn('Geolocation access error, using default Tuzla center', error);
          // Default fallback location near Skver Tuzla
          setUserLocation({ lat: 44.538, lng: 18.675 });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const handleStartNavigation = async (lot: ParkingLotData) => {
    setSelectedLot(lot);
    const startLoc = userLocation || { lat: 44.538, lng: 18.675 };
    
    // Immediately open navigation HUD and draw route on map
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

  const handleVoiceFindClosest = (): ParkingLotData | null => {
    const startLoc = userLocation || { lat: 44.538, lng: 18.675 };
    let closest: ParkingLotData | null = null;
    let minDistance = Infinity;

    TUZLA_PARKING_DATA.forEach((lot) => {
      const dist = calculateDistanceMeters(startLoc.lat, startLoc.lng, lot.coordinates[1], lot.coordinates[0]);
      if (dist < minDistance) {
        minDistance = dist;
        closest = lot;
      }
    });

    if (closest) {
      setSelectedLot(closest);
      handleStartNavigation(closest);
      return closest;
    }
    return null;
  };

  const handleVoiceStartPayment = () => {
    const lot = selectedLot || TUZLA_PARKING_DATA[0];
    handleOpenSmsPay(lot);
  };

  return (
    <div className="min-h-screen bg-[#041530] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Smartphone Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOnline={isOnline}
        deferredInstallPrompt={deferredInstallPrompt}
        onInstallPwa={handleInstallPwa}
        activeTimerCount={activeSession && activeSession.endTime > Date.now() ? 1 : 0}
        onOpenTimer={() => setActiveTab('timer')}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Screen Content Body */}
      <main className="flex-1 relative overflow-x-hidden">
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
      </main>

      {/* Active Navigation Floating Drawer */}
      <NavigationDrawer
        route={activeRoute}
        onStopNavigation={() => setActiveRoute(null)}
        onPaySmsForLot={handleOpenSmsPay}
        currentLang={currentLang}
      />

      {/* SMS Payment Modal Drawer */}
      <SmsPaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        selectedLot={selectedLot}
        onSessionStarted={handleSessionStarted}
        currentLang={currentLang}
      />

      {/* Fixed Smartphone Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#061d40] border-t border-[#d4af37]/30 px-3 py-2 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          {/* Map Tab */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'map'
                ? 'text-[#d4af37] font-bold bg-[#041530] border border-[#d4af37]/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.map}</span>
          </button>

          {/* List Tab */}
          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'list'
                ? 'text-[#d4af37] font-bold bg-[#041530] border border-[#d4af37]/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.list}</span>
          </button>

          {/* SMS Pay Direct Tab */}
          <button
            onClick={() => handleOpenSmsPay(selectedLot || TUZLA_PARKING_DATA[0])}
            className="flex flex-col items-center justify-center py-1 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#041530] font-black shadow-lg shadow-[#d4af37]/20 active:scale-95 transition-all -mt-3 border-2 border-[#061d40]"
          >
            <MessageSquare className="w-5 h-5 mb-0.5 fill-current" />
            <span className="text-[9px] uppercase font-black leading-none">{t.tabs.pay}</span>
          </button>

          {/* Timer Tab */}
          <button
            onClick={() => setActiveTab('timer')}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'timer'
                ? 'text-[#d4af37] font-bold bg-[#041530] border border-[#d4af37]/40 shadow-md'
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
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'vehicle'
                ? 'text-[#d4af37] font-bold bg-[#041530] border border-[#d4af37]/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-tight">{t.tabs.vehicle}</span>
          </button>
        </div>
      </nav>

      {/* Voice Commands Assistant Modal */}
      <VoiceAssistant
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        onFindClosestParking={handleVoiceFindClosest}
        onStartPayment={handleVoiceStartPayment}
        onSwitchTab={setActiveTab}
      />
    </div>
  );
}
