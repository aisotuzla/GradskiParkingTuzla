import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, RefreshCw, XCircle, Car, Shield, Send } from 'lucide-react';
import { Language, ParkingPaymentSession } from '../types';
import { ZONE_DETAILS } from '../data/parkingData';
import { TRANSLATIONS } from '../data/translations';
import { formatPlateDisplay, generateSmsUri, saveActiveSession } from '../services/smsService';

interface ActiveTimerWidgetProps {
  session: ParkingPaymentSession | null;
  onClearSession: () => void;
  onExtendSession: () => void;
  currentLang: Language;
}

export const ActiveTimerWidget: React.FC<ActiveTimerWidgetProps> = ({
  session,
  onClearSession,
  onExtendSession,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const remaining = session.endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeftMs(0);
        clearInterval(interval);
      } else {
        setTimeLeftMs(remaining);
      }
    }, 1000);

    // Initial compute
    const initial = session.endTime - Date.now();
    setTimeLeftMs(Math.max(0, initial));

    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="p-6 bg-[#1a2a44] border border-[#d4af37]/20 rounded-2xl text-center max-w-md mx-auto my-6 text-slate-300 shadow-lg">
        <Clock className="w-10 h-10 text-[#d4af37] mx-auto mb-2 opacity-80" />
        <h3 className="font-bold text-sm text-slate-100 mb-1">{t.timer.title}</h3>
        <p className="text-xs text-slate-400">{t.timer.noActiveSession}</p>
      </div>
    );
  }

  const zoneInfo = ZONE_DETAILS[session.zone];
  const isExpiringSoon = timeLeftMs > 0 && timeLeftMs < 10 * 60 * 1000; // < 10 minutes

  // Format time
  const totalSecs = Math.floor(timeLeftMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const formattedStartTime = new Date(session.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedEndTime = new Date(session.endTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-[#1a2a44] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-md mx-auto my-3 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#0a1128] flex items-center justify-center font-extrabold shadow-sm">
            <Clock className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#d4af37] uppercase tracking-wide">{t.timer.title}</h3>
            <p className="text-[11px] text-slate-300 font-medium">{session.parkingName}</p>
          </div>
        </div>

        <button
          onClick={onClearSession}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          title={t.timer.cancelSession}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Warning Banner if < 10 mins */}
      {isExpiringSoon && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-bold">{t.timer.warning10Min}</span>
        </div>
      )}

      {/* Countdown Timer Display */}
      <div className="bg-[#0a1128] border border-[#d4af37]/30 rounded-xl p-4 text-center mb-4 shadow-inner">
        <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-1">
          {t.timer.expiresIn}
        </span>
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-[#d4af37] drop-shadow-md">
          {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:
          {String(secs).padStart(2, '0')}
        </div>
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-[#14213d] p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 text-[10px] block">{t.timer.vehicle}</span>
          <span className="font-extrabold text-white text-sm font-mono">
            {formatPlateDisplay(session.licensePlate)}
          </span>
        </div>

        <div className="bg-[#14213d] p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 text-[10px] block">{t.timer.zone}</span>
          <span className="font-extrabold uppercase text-sm text-[#d4af37]">
            Zona {session.zone} ({session.totalPrice.toFixed(1)} KM)
          </span>
        </div>

        <div className="bg-[#14213d] p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 text-[10px] block">{t.timer.startedAt}</span>
          <span className="font-bold text-slate-200">{formattedStartTime}</span>
        </div>

        <div className="bg-[#14213d] p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 text-[10px] block">{t.timer.expiresAt}</span>
          <span className="font-bold text-slate-200">{formattedEndTime}</span>
        </div>
      </div>

      {/* Action: Extend Parking */}
      <button
        onClick={onExtendSession}
        className="w-full py-3 px-4 rounded-lg bg-[#d4af37] text-[#0a1128] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-[#b8860b] active:scale-95 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{t.timer.extendParking}</span>
      </button>
    </div>
  );
};
