import React, { useState, useEffect } from 'react';
import { Car, Navigation } from 'lucide-react';
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

interface QuickSmsPanelProps {
  activeZone: ParkingZone;
  onZoneChange: (zone: ParkingZone) => void;
  selectedLot: ParkingLotData | null;
  onSessionStarted: (session: ParkingPaymentSession) => void;
  currentLang: Language;
}

export const QuickSmsPanel: React.FC<QuickSmsPanelProps> = ({
  activeZone,
  onZoneChange,
  selectedLot,
  onSessionStarted,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [licensePlate, setLicensePlate] = useState<string>('E12-M-345');
  const [hours, setHours] = useState<number>(1);
  const [isDayTicket, setIsDayTicket] = useState<boolean>(false);
  const [savedPlates, setSavedPlates] = useState<string[]>(['E12-M-345', 'A12-K-890']);

  useEffect(() => {
    const plates = getSavedPlates();
    if (plates.length > 0) {
      setSavedPlates(plates);
      if (!licensePlate) setLicensePlate(plates[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedLot?.zone) {
      onZoneChange(selectedLot.zone);
    }
  }, [selectedLot]);

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

    if (isDayTicket) {
      window.location.href = smsUri;
      return;
    }

    for (let i = 0; i < hours; i++) {
      setTimeout(() => {
        window.location.href = generateSmsUri(activeSmsNumber, cleanPlate);
      }, i * 300);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#061433] via-[#040e26] to-[#020714] text-white p-3 border-t-2 border-[#d4af37]/60 shadow-2xl flex flex-col justify-between overflow-y-auto font-sans">
      {/* Zone Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {(['0', '1', '2'] as ParkingZone[]).map((zone) => {
          const details = ZONE_DETAILS[zone];
          const isSelected = activeZone === zone;
          const zoneSmsNum = getSmsNumber(zone, false);
          const colorClass =
            zone === '0'
              ? 'text-red-400 border-red-500/40'
              : zone === '1'
              ? 'text-sky-400 border-sky-500/40'
              : 'text-emerald-400 border-emerald-500/40';

          return (
            <button
              key={zone}
              type="button"
              onClick={() => onZoneChange(zone)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? `bg-[#0a2352] border-[#d4af37] ring-1 ring-[#d4af37]/70 text-white shadow-lg ${colorClass}`
                  : 'bg-[#051330]/80 border-slate-700/60 text-slate-300 hover:bg-[#081e42]'
              }`}
            >
              <div className={`text-[11px] font-black uppercase tracking-wider ${
                zone === '0' ? 'text-red-400' : zone === '1' ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {t.parkingList.zoneLabel} {zone}
              </div>
              <div className="text-[11px] font-bold text-slate-100 mt-0.5">
                {details.hourlyPrice.toFixed(1)} {t.zones.pricePerHour}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5 font-bold">
                {zoneSmsNum}
              </div>
            </button>
          );
        })}
      </div>

      {/* License Plate Row */}
      <div className="mt-2">
        <div className="relative flex items-center bg-[#071738] border border-[#d4af37]/40 rounded-xl px-3 py-1.5">
          <Car className="w-4 h-4 text-[#d4af37] mr-2 shrink-0" />
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
            placeholder={t.smsPayment.licensePlatePlaceholder}
            className="w-full bg-transparent text-sm font-bold text-white tracking-widest uppercase focus:outline-none"
          />
        </div>
        {savedPlates.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5 overflow-x-auto">
            {savedPlates.map((plate) => (
              <button
                key={plate}
                type="button"
                onClick={() => setLicensePlate(plate)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                  sanitizePlate(licensePlate) === sanitizePlate(plate)
                    ? 'bg-[#d4af37] text-[#040e26] font-bold border-[#d4af37]'
                    : 'bg-[#0a1c3f] text-slate-300 border-slate-700 hover:bg-[#0e2554]'
                }`}
              >
                {formatPlateDisplay(plate)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duration Selector */}
      <div className="grid grid-cols-4 gap-1.5 mt-2">
        {[1, 2, 3].map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => {
              setHours(h);
              setIsDayTicket(false);
            }}
            className={`py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              !isDayTicket && hours === h
                ? 'bg-[#d4af37] text-[#040e26] border-[#d4af37] shadow-md'
                : 'bg-[#051330] text-slate-300 border-slate-700/60 hover:bg-[#081e42]'
            }`}
          >
            {h}{t.timer.hourShort}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsDayTicket(true)}
          className={`py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer capitalize ${
            isDayTicket
              ? 'bg-[#d4af37] text-[#040e26] border-[#d4af37] shadow-md'
              : 'bg-[#051330] text-slate-300 border-slate-700/60 hover:bg-[#081e42]'
          }`}
        >
          {t.vehicle.day}
        </button>
      </div>

      {/* SMS Action Bar */}
      <div className="flex gap-2 items-stretch mt-2">
        <div className="bg-[#051330] border border-[#d4af37]/40 rounded-xl px-3 py-1.5 flex flex-col justify-center shrink-0 min-w-[95px]">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">{t.common.total}</div>
          <div className="text-sm font-black text-[#d4af37] leading-none">
            {totalPrice.toFixed(2)} <span className="text-[9px] text-slate-300">KM</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">SMS {activeSmsNumber}</div>
        </div>

        <button
          type="button"
          onClick={handleSendSms}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#040e26] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#d4af37]/20 border border-[#fff5c0]/50 active:scale-95 transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 fill-current rotate-90" />
          <span>{t.smsPayment.sendSmsButton}</span>
        </button>
      </div>
    </div>
  );
};
