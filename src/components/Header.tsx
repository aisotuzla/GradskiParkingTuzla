import React from 'react';
import { Shield, Globe, Wifi, WifiOff, Clock, Download, Car, Mic } from 'lucide-react';
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
  onOpenVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isOnline,
  deferredInstallPrompt,
  onInstallPwa,
  activeTimerCount,
  onOpenTimer,
  onOpenVoice,
}) => {
  const t = TRANSLATIONS[currentLang];
  const activeWorking = isWorkingHoursNow();
  const timeRemainingHours = getTimeUntilWorkingHoursEnd();

  return (
    <header className="sticky top-0 z-40 bg-[#061d40] border-b border-[#d4af37]/30 shadow-lg px-3 sm:px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Title & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-lg flex items-center justify-center shadow-inner shrink-0">
            <Car className="w-5 h-5 text-[#041530]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight text-[#d4af37] leading-none">
                TUZLA<span className="text-white ml-1 font-bold">PARKING</span>
              </h1>
              {/* Online / Offline badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isOnline
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
                title={isOnline ? t.pwa.onlineMode : t.pwa.offlineReady}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isOnline ? 'LIVE' : 'OFFLINE'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-[#d4af37]" />
              <span className={activeWorking ? 'text-green-400 font-semibold' : 'text-slate-400'}>
                {activeWorking ? `Radno vrijeme do 22:00h (${timeRemainingHours})` : 'Van radnog vremena (Besplatno)'}
              </span>
            </p>
          </div>
        </div>

        {/* Controls: Voice Mic + Active Timer Badge + Language Switcher + PWA Install */}
        <div className="flex items-center gap-1.5">
          {/* Voice Assistant Mic Button */}
          <button
            onClick={onOpenVoice}
            className="p-1.5 rounded-lg bg-[#d4af37] text-[#041530] hover:bg-[#b8860b] active:scale-95 transition-all shadow-md flex items-center justify-center"
            title={t.voice?.title || 'Glasovne Komande'}
          >
            <Mic className="w-4 h-4" />
          </button>

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

          {/* PWA Install Button if available */}
          {deferredInstallPrompt && (
            <button
              onClick={onInstallPwa}
              className="p-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/30 transition-all text-xs font-semibold flex items-center gap-1"
              title={t.pwa.installButton}
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">{t.pwa.installButton}</span>
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
                className={`px-2 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
                  currentLang === code
                    ? 'bg-[#d4af37] text-[#041530] shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={title}
              >
                <span className="text-sm leading-none">{flag}</span>
                <span className="text-[10px] uppercase">{code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
