import React from 'react';
import { Clock, Download, Car } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  deferredInstallPrompt: any;
  onInstallPwa: () => void;
  activeTimerCount: number;
  onOpenTimer: () => void;
  isAppInstalled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onInstallPwa,
  activeTimerCount,
  onOpenTimer,
  isAppInstalled,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0a2557] via-[#081f4c] to-[#030816] backdrop-blur-2xl border-b border-[#d4af37]/40 shadow-2xl px-3 sm:px-4 py-3 font-sans">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Title & Brand */}
        <div className="flex items-center gap-2.5">
          {/* Download icon when not installed, Car icon when installed */}
          <button
            onClick={onInstallPwa}
            className="w-10 h-10 bg-gradient-to-br from-[#ffd86b] via-[#d4af37] to-[#8f6a13] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#fff5c0]/50 group"
            title={isAppInstalled ? t.appTitle : t.header.installApp}
            aria-label={isAppInstalled ? t.appTitle : t.header.installApp}
          >
            {isAppInstalled ? (
              <Car className="w-5 h-5 text-[#040e26]" />
            ) : (
              <Download className="w-5 h-5 text-[#040e26] group-hover:bounce" />
            )}
          </button>
          <div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-black text-[#ffd700] uppercase tracking-[0.2em] leading-none mb-0.5">
                GRADSKI
              </span>
              <h1 className="font-heading font-black tracking-tight text-base sm:text-lg drop-shadow-md leading-none flex items-center gap-1">
                <span className="gold-gradient-text">PARKING</span>
                <span className="text-white font-black">TUZLA</span>
              </h1>
            </div>
            <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>{t.workingHours.label}</span>
            </p>
          </div>
        </div>

        {/* Controls: Active Timer Badge + Language Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Active Parking Session Timer Button */}
          {activeTimerCount > 0 && (
            <button
              onClick={onOpenTimer}
              className="relative p-1.5 rounded-lg bg-gradient-to-b from-[#1d4ed8]/30 to-[#08153b]/40 border border-[#d4af37]/50 text-[#ffd86b] animate-pulse hover:bg-[#1d4ed8]/40 transition-colors cursor-pointer"
              title={t.timer.title}
            >
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] text-[#041530] font-black text-[10px] flex items-center justify-center shadow-md">
                {activeTimerCount}
              </span>
            </button>
          )}

          {/* Language Flag Selector */}
          <div className="flex bg-[#041530] rounded-full p-0.5 border border-[#d4af37]/70 shadow-[0_0_18px_rgba(29,78,216,0.22)]">
            {[
              { code: 'bs', flag: 'https://flagcdn.com/w40/ba.png', title: 'Bosanski' },
              { code: 'en', flag: 'https://flagcdn.com/w40/gb.png', title: 'English' },
              { code: 'de', flag: 'https://flagcdn.com/w40/de.png', title: 'Deutsch' },
            ].map(({ code, flag, title }) => (
              <button
                key={code}
                onClick={() => onLanguageChange(code as Language)}
                className={`w-8 h-7 rounded-full transition-all flex items-center justify-center border cursor-pointer ${currentLang === code
                  ? 'bg-[#061d40] border-[#d4af37] shadow-md scale-105'
                  : 'bg-transparent border-transparent opacity-70 hover:opacity-100'
                  }`}
                title={title}
              >
                <img src={flag} alt={title} className="w-5 h-5 rounded-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
