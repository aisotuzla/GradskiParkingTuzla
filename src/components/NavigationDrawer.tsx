import React from 'react';
import {
  X,
  Compass,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  WifiOff,
  MessageSquare,
} from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatDistance, formatDuration } from '../services/routingService';

interface NavigationDrawerProps {
  route: NavigationRoute | null;
  onStopNavigation: () => void;
  onPaySmsForLot: (lot: ParkingLotData) => void;
  currentLang: Language;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  route,
  onStopNavigation,
  onPaySmsForLot,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];



  if (!route) return null;

  const { targetLot, distance, duration, steps, isOffline } = route;

  const renderStepIcon = (action?: string) => {
    switch (action) {
      case 'turn-left':
        return <ArrowLeft className="w-5 h-5 text-[#d4af37]" />;
      case 'turn-right':
        return <ArrowRight className="w-5 h-5 text-[#d4af37]" />;
      case 'arrive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <ArrowUp className="w-5 h-5 text-[#d4af37]" />;
    }
  };



  return (
    <div className="w-full h-full bg-[#061d40] border-t-2 border-[#d4af37]/60 text-white p-3 sm:p-4 flex flex-col justify-between overflow-hidden z-30 opacity-100 shadow-2xl">
      {/* Top Bar: Title & Controls */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#041530] border border-[#d4af37]/60 flex items-center justify-center shrink-0 shadow-md">
            <Compass className="w-5 h-5 text-[#d4af37] animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-wider">
                {t.navigation.title}
              </span>
              {isOffline && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/30 text-amber-200 border border-amber-500/50 flex items-center gap-0.5">
                  <WifiOff className="w-2.5 h-2.5" />
                  Offline
                </span>
              )}
            </div>
            <h2 className="font-black text-base text-[#d4af37] truncate">
              {targetLot.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Close / Stop button */}
          <button
            onClick={onStopNavigation}
            className="p-1.5 rounded-full bg-[#041530] text-white hover:bg-red-600 transition-colors border border-slate-700"
            title="Zaustavi Navigaciju"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Distance & Time Row */}
      <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
        <div className="bg-[#041530] border border-[#d4af37]/40 rounded-xl p-2 text-center shadow-md">
          <span className="text-[10px] text-[#d4af37] block uppercase font-black">
            {t.navigation.distance}
          </span>
          <span className="text-base sm:text-lg font-black text-white font-mono">
            {formatDistance(distance)}
          </span>
        </div>

        <div className="bg-[#041530] border border-[#d4af37]/40 rounded-xl p-2 text-center shadow-md">
          <span className="text-[10px] text-[#d4af37] block uppercase font-black">
            {t.navigation.estTime}
          </span>
          <span className="text-base sm:text-lg font-black text-white font-mono">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Turn-by-Turn Steps (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar mb-2">
        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-wider block mb-1">
          {t.navigation.stepsHeader}
        </span>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl bg-[#041530] border border-slate-700/80 text-xs text-white"
          >
            <div className="p-1 rounded-lg bg-[#061d40] border border-[#d4af37]/30 shrink-0">
              {renderStepIcon(step.action)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-xs leading-snug truncate">
                {step.instruction}
              </p>
              {step.distance > 0 && (
                <span className="text-[10px] text-[#d4af37] font-mono font-semibold">
                  {formatDistance(step.distance)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2 shrink-0 pt-1 border-t border-[#d4af37]/30">
        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            onStopNavigation();
          }}
          className="py-2.5 px-3 rounded-xl bg-[#041530] border border-red-500/60 text-white font-bold text-xs hover:bg-red-950/40 transition-colors shadow-md text-center"
        >
          {t.navigation.stopNav}
        </button>

        <button
          onClick={() => onPaySmsForLot(targetLot)}
          className="py-2.5 px-3 rounded-xl bg-[#d4af37] text-[#061d40] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg hover:bg-[#b8860b] active:scale-95 transition-all text-center"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Stigao sam - SMS</span>
        </button>
      </div>
    </div>
  );
};
