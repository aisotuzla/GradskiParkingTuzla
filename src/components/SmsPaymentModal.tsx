import React, { useState, useEffect } from 'react';
import { X, Send, Copy, Check, MessageSquare, Car } from 'lucide-react';
import { Language, ParkingLotData, ParkingPaymentSession, ParkingZone } from '../types';
import { ZONE_DETAILS, getSmsNumber } from '../data/parkingData';
import { TRANSLATIONS } from '../data/translations';
import {
  calculateParkingCost,
  createPaymentSession,
  formatPlateDisplay,
  generateSmsUri,
  getSavedPlates,
  sanitizePlate,
} from '../services/smsService';

interface SmsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLot: ParkingLotData | null;
  onSessionStarted: (session: ParkingPaymentSession) => void;
  currentLang: Language;
}

export const SmsPaymentModal: React.FC<SmsPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedLot,
  onSessionStarted,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [activeZone, setActiveZone] = useState<ParkingZone>('1');
  const [licensePlate, setLicensePlate] = useState<string>('E12M345');
  const [hours, setHours] = useState<number>(1);
  const [isDayTicket, setIsDayTicket] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedPlates, setSavedPlates] = useState<string[]>([]);

  // Sync zone with selected lot
  useEffect(() => {
    if (selectedLot) {
      setActiveZone(selectedLot.zone);
    }
  }, [selectedLot]);

  // Load saved plates
  useEffect(() => {
    if (isOpen) {
      const plates = getSavedPlates();
      setSavedPlates(plates);
      if (plates.length > 0 && !licensePlate) {
        setLicensePlate(plates[0]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeSmsNumber = getSmsNumber(activeZone, isDayTicket);
  const totalPrice = calculateParkingCost(activeZone, hours, isDayTicket);
  const cleanPlate = sanitizePlate(licensePlate);
  const smsUri = generateSmsUri(activeSmsNumber, cleanPlate);

  const handleSendSms = () => {
    if (!cleanPlate || cleanPlate.length < 3) {
      alert(t.smsPayment.invalidPlateAlert);
      return;
    }

    const session = createPaymentSession(
      activeZone,
      cleanPlate,
      hours,
      isDayTicket,
      selectedLot?.id,
      selectedLot?.name
    );

    onSessionStarted(session);

    // Launch native SMS application
    window.location.href = smsUri;
  };

  const handleCopySms = () => {
    if (!cleanPlate) return;
    const textToCopy = `SMS: ${activeSmsNumber}\n${cleanPlate}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    const session = createPaymentSession(
      activeZone,
      cleanPlate,
      hours,
      isDayTicket,
      selectedLot?.id,
      selectedLot?.name
    );
    onSessionStarted(session);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0b1e4f] via-[#09183d] to-[#040e26] border border-[#d4af37]/50 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#9a7b1c] text-[#040e26] flex items-center justify-center font-extrabold shadow-lg shadow-[#d4af37]/20 border border-[#fff5c0]/50">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg gold-gradient-text uppercase tracking-wide leading-tight">{t.smsPayment.title}</h2>
              {selectedLot && (
                <p className="text-xs text-slate-200 font-semibold">{selectedLot.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#0b1a45] text-slate-300 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">
            1. {t.smsPayment.selectZone}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['0', '1', '2'] as ParkingZone[]).map((zone) => {
              const details = ZONE_DETAILS[zone];
              const isSelected = activeZone === zone;
              const zoneSmsNum = getSmsNumber(zone, isDayTicket);
              const zoneColor =
                zone === '0'
                  ? 'border-red-500/50 text-red-400'
                  : zone === '1'
                  ? 'border-sky-500/50 text-sky-400'
                  : 'border-emerald-500/50 text-emerald-400';

              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${zoneColor} ${
                    isSelected
                      ? 'bg-[#08224d] border-[#d4af37] ring-1 ring-[#d4af37] text-white font-bold shadow-lg'
                      : 'bg-[#061938]/60 text-slate-400 hover:bg-[#08224d]'
                  }`}
                >
                  <div className={`text-xs font-black uppercase tracking-wider ${
                    zone === '0' ? 'text-red-400' : zone === '1' ? 'text-sky-400' : 'text-emerald-400'
                  }`}>
                    {t.parkingList.zoneLabel} {zone}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {details.hourlyPrice.toFixed(1)} {t.zones.pricePerHour}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5 font-bold">
                    {zoneSmsNum}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* License Plate Input & Recent Plates */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>2. {t.smsPayment.licensePlateLabel}</span>
            <span className="text-[10px] text-slate-400 font-normal">e.g. E12-M-345</span>
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-3 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              placeholder={t.smsPayment.licensePlatePlaceholder}
              className="w-full bg-[#0a1128] border border-[#d4af37]/40 rounded-lg pl-9 pr-3 py-2.5 text-base font-bold text-white tracking-widest placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Quick Select Saved Plates */}
          {savedPlates.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400">{t.smsPayment.recentPlates}</span>
              {savedPlates.map((plate) => (
                <button
                  key={plate}
                  type="button"
                  onClick={() => setLicensePlate(plate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                    sanitizePlate(licensePlate) === sanitizePlate(plate)
                      ? 'bg-[#d4af37] text-[#0a1128] font-bold border-[#d4af37]'
                      : 'bg-[#1a2a44] text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {formatPlateDisplay(plate)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duration Selection */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">
            3. {t.smsPayment.selectDuration}
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setHours(h);
                  setIsDayTicket(false);
                }}
                className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !isDayTicket && hours === h
                    ? 'bg-[#d4af37] text-[#0a1128] border-[#d4af37] shadow-md'
                    : 'bg-[#14213d] text-slate-300 border-slate-700 hover:bg-[#1a2a44]'
                }`}
              >
                {h}{t.timer.hourShort}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsDayTicket(true)}
              className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                isDayTicket
                  ? 'bg-[#d4af37] text-[#0a1128] border-[#d4af37] shadow-md'
                  : 'bg-[#14213d] text-slate-300 border-slate-700 hover:bg-[#1a2a44]'
              }`}
            >
              {t.smsPayment.dayTicket}
            </button>
          </div>
        </div>

        {/* Total Price Box */}
        <div className="bg-[#08224d] border border-[#d4af37]/30 rounded-xl p-4 mb-5 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-xs text-slate-300 font-medium">{t.smsPayment.totalAmount}</div>
            <div className="text-[11px] text-slate-200 font-mono font-bold">
              SMS {activeSmsNumber} • {cleanPlate || '---'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#d4af37]">{totalPrice.toFixed(2)}</span>
            <span className="text-xs font-bold text-slate-300 ml-1">KM</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSendSms}
            className="w-full py-3.5 px-4 rounded-lg bg-[#d4af37] text-[#0a1128] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-[#b8860b] active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>{t.sendSmsButton || t.smsPayment.sendSmsButton}</span>
          </button>

          <button
            onClick={handleCopySms}
            className="w-full py-2.5 px-4 rounded-lg bg-[#14213d] border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1a2a44] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
            <span>{copied ? t.smsPayment.copied : t.smsPayment.copySms}</span>
          </button>
        </div>

        {/* Note */}
        <p className="text-[10px] text-slate-400 text-center mt-3">
          {t.smsPayment.instructions}
        </p>
      </div>
    </div>
  );
};
