import React from 'react';
import { Shield, Globe, Wifi, WifiOff, Clock, Download, Car } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { isWorkingHoursNow, getTimeUntilWorkingHoursEnd } from '../services/smsService';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  deferredInstallPrompt: any;
  onInstallPwa: () => void;
  activeTimerCount: number;
  onOpenTimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isOnline,
  deferredInstallPrompt,
  onInstallPwa,
  activeTimerCount,
  onOpenTimer,
}) => {
  const t = TRANSLATIONS[currentLang];
  const activeWorking = isWorkingHoursNow();
  const timeRemainingHours = getTimeUntilWorkingHoursEnd();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0b1e4f] via-[#102a70] to-[#08153b] backdrop-blur-2xl border-b border-[#d4af37]/40 shadow-2xl px-3 sm:px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Title & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onInstallPwa}
            className="w-10 h-10 bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#9a7b1c] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#fff5c0]/50"
            title={deferredInstallPrompt ? t.pwa.installButton : 'Instaliraj Tuzla Parking'}
          >
            <Car className="w-5 h-5 text-[#040e26]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-xl tracking-tight gold-gradient-text drop-shadow-md leading-none">
                TUZLA<span className="text-white ml-1 font-extrabold tracking-normal">PARKING</span>
              </h1>
              {/* Online / Offline badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  isOnline
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                }`}
                title={isOnline ? t.pwa.onlineMode : t.pwa.offlineReady}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isOnline ? 'LIVE' : 'OFFLINE'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className={activeWorking ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                {activeWorking ? `Radno vrijeme do 22:00h (${timeRemainingHours})` : 'Van radnog vremena (Besplatno)'}
              </span>
            </p>
          </div>
        </div>

        {/* Controls: Active Timer Badge + Language Switcher + PWA Install */}
        <div className="flex items-center gap-1.5">
          {/* Active Parking Session Timer Button */}
          {activeTimerCount > 0 && (
            <button
              onClick={onOpenTimer}
              className="relative p-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] animate-pulse hover:bg-[#d4af37]/30 transition-colors"
              title={t.timer.title}
            >
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] text-[#041530] font-black text-[10px] flex items-center justify-center shadow-md">
                {activeTimerCount}
              </span>
            </button>
          )}



          {/* Language Flag Selector (Bosnia 🇧🇦, UK 🇬🇧, Germany 🇩🇪) */}
          <div className="flex bg-[#041530] rounded-full p-0.5 border border-[#d4af37]/30">
            {[
              { code: 'bs', flag: '🇧🇦', title: 'Bosanski' },
              { code: 'en', flag: '🇬🇧', title: 'English' },
              { code: 'de', flag: '🇩🇪', title: 'Deutsch' },
            ].map(({ code, flag, title }) => (
              <button
                key={code}
                onClick={() => onLanguageChange(code as Language)}
                className={`px-2 py-1 rounded-full transition-all flex items-center justify-center ${
                  currentLang === code
                    ? 'bg-[#d4af37] shadow-md scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title={title}
              >
                <span className="text-base leading-none">{flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
