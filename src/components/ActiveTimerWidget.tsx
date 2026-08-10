import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Car,
  Shield,
  Send,
  Bell,
  BellRing,
  CheckCircle,
  Receipt,
  TrendingUp,
  Calendar,
  History,
  Trash2,
} from 'lucide-react';
import { Language, ParkingPaymentSession } from '../types';
import { ZONE_DETAILS } from '../data/parkingData';
import { TRANSLATIONS } from '../data/translations';
import {
  formatPlateDisplay,
  generateSmsUri,
  saveActiveSession,
  getPaymentHistory,
  getPaymentStats,
  clearPaymentHistory,
} from '../services/smsService';

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
  const [historyList, setHistoryList] = useState<ParkingPaymentSession[]>([]);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  // Load payment history on mount and when session updates
  useEffect(() => {
    setHistoryList(getPaymentHistory());
  }, [session]);

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

  const handleClearHistory = () => {
    if (window.confirm('Sigurno želite obrisati historiju plaćanja?')) {
      clearPaymentHistory();
      setHistoryList([]);
    }
  };

  const isExpiringSoon = timeLeftMs > 0 && timeLeftMs < 10 * 60 * 1000; // < 10 minutes

  // Format active session time
  const totalSecs = Math.floor(timeLeftMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const formattedStartTime = session
    ? new Date(session.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const formattedEndTime = session
    ? new Date(session.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const stats = getPaymentStats(historyList);

  return (
    <div className="max-w-md mx-auto my-3 px-1 space-y-4 text-slate-100">
      {/* Active Session Timer Card OR Empty State */}
      {session ? (
        <div className="bg-[#1a2a44] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-2xl">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#0a1128] flex items-center justify-center font-extrabold shadow-sm">
                <Clock className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#d4af37] uppercase tracking-wide">
                  {t.timer.title}
                </h3>
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

          {/* Push Notification Alert Toggle Banner */}
          <div className="mb-3 p-2.5 rounded-xl bg-[#0a1128]/80 border border-[#d4af37]/30 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {notifPermission === 'granted' ? (
                <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Bell className="w-4 h-4 text-[#d4af37] shrink-0" />
              )}
              <div>
                <span className="font-bold text-slate-200 block">Obavještenja o isteku</span>
                <span className="text-[10px] text-slate-400">
                  {notifPermission === 'granted'
                    ? 'Automatsko upozorenje 10 min prije isteka'
                    : 'Uključi push notifikacije kad parking ističe'}
                </span>
              </div>
            </div>

            {notifPermission !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="px-2.5 py-1 rounded-md bg-[#d4af37] text-[#0a1128] font-bold text-[11px] hover:bg-[#b8860b] transition-all shrink-0"
              >
                Omogući
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle className="w-3 h-3" /> Aktivno
              </span>
            )}
          </div>

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
      ) : (
        <div className="p-5 bg-[#1a2a44] border border-[#d4af37]/30 rounded-2xl text-center text-slate-300 shadow-lg">
          <Clock className="w-10 h-10 text-[#d4af37] mx-auto mb-2 opacity-80" />
          <h3 className="font-bold text-sm text-slate-100 mb-1">{t.timer.title}</h3>
          <p className="text-xs text-slate-400 mb-2">{t.timer.noActiveSession}</p>
        </div>
      )}

      {/* Payment History & Statistics Section */}
      <div className="bg-[#1a2a44] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a1128] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {t.timer.historyTitle || 'Historija Plaćanja & Statistika'}
              </h3>
              <p className="text-[11px] text-slate-400">Pregled potrošnje i evidencija SMS kartica</p>
            </div>
          </div>

          {historyList.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg bg-[#0a1128] border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
              title={t.timer.clearHistory || 'Obriši historiju'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Day Total */}
          <div className="bg-[#0a1128] border border-[#d4af37]/30 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              {t.timer.dayTotal || 'Danas ukupno'}
            </span>
            <span className="text-lg font-black text-[#d4af37] font-mono">
              {stats.dayTotal.toFixed(1)} KM
            </span>
          </div>

          {/* Month Total */}
          <div className="bg-[#0a1128] border border-[#d4af37]/30 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              {t.timer.monthTotal || 'Ovaj mjesec'}
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {stats.monthTotal.toFixed(1)} KM
            </span>
          </div>

          {/* Total Payments Count */}
          <div className="bg-[#0a1128] border border-slate-700/60 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              {t.timer.totalPayments || 'Transakcije'}
            </span>
            <span className="text-lg font-black text-slate-100 font-mono">
              {stats.totalCount}
            </span>
          </div>

          {/* Total Spent */}
          <div className="bg-[#0a1128] border border-slate-700/60 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              {t.timer.totalSpent || 'Ukupno'}
            </span>
            <span className="text-lg font-black text-slate-200 font-mono">
              {stats.totalSpent.toFixed(1)} KM
            </span>
          </div>
        </div>

        {/* Previous Payment Items List */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Zabilježena Plaćanja ({historyList.length})
          </span>

          {historyList.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#0a1128] text-center text-xs text-slate-400 border border-slate-800">
              {t.timer.noHistory || 'Nema zabilježenih prethodnih plaćanja.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {historyList.map((item) => {
                const dateStr = new Date(item.startTime).toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const details = ZONE_DETAILS[item.zone];
                const smsUri = generateSmsUri(item.smsNumber, item.smsBody);

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0a1128] border border-slate-700/60 hover:border-[#d4af37]/40 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-[#0a1128]"
                          style={{ backgroundColor: details?.color || '#d4af37' }}
                        >
                          Zona {item.zone}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {item.parkingName || details?.name || `Zona ${item.zone}`}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="font-mono font-bold text-[#d4af37]">
                          {formatPlateDisplay(item.licensePlate)}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span>{item.isDayTicket ? 'Dnevna kartica' : `${item.hours}h`}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {item.totalPrice.toFixed(1)} KM
                      </span>
                      <a
                        href={smsUri}
                        className="px-2 py-1 rounded-md bg-[#14213d] hover:bg-[#d4af37] text-slate-200 hover:text-[#0a1128] border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition-all"
                        title="Ponovo pošalji SMS"
                      >
                        <Send className="w-3 h-3" />
                        <span>{t.timer.repaySms || 'SMS'}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
