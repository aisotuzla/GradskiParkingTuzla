import React, { useState, useMemo } from 'react';
import { Search, MapPin, MessageSquare, Car, Compass, Locate } from 'lucide-react';

import { Language, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { calculateDistanceMeters, formatDistance } from '../services/routingService';

interface ParkingListProps {
  parkingLots: ParkingLotData[];
  selectedLot: ParkingLotData | null;
  onSelectLot: (lot: ParkingLotData) => void;
  onPaySms: (lot: ParkingLotData) => void;
  onStartNavigation: (lot: ParkingLotData) => void;
  userLocation: UserLocation | null;
  onRequestUserLocation: () => Promise<UserLocation | null>;
  currentLang: Language;
}

export const ParkingList: React.FC<ParkingListProps> = ({
  parkingLots,
  selectedLot,
  onSelectLot,
  onPaySms,
  onStartNavigation,
  userLocation,
  onRequestUserLocation,
  currentLang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<ParkingZone | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const t = TRANSLATIONS[currentLang];

  const lotsWithDistance = useMemo(() => {
    return parkingLots.map((lot) => {
      let distMeters = 0;
      if (userLocation) {
        distMeters = calculateDistanceMeters(
          userLocation.lat,
          userLocation.lng,
          lot.coordinates[1],
          lot.coordinates[0]
        );
      }
      return { ...lot, distMeters };
    });
  }, [parkingLots, userLocation]);

  const filteredLots = useMemo(() => {
    const result = lotsWithDistance.filter((lot) => {
      const matchesSearch =
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = selectedZone === 'all' || lot.zone === selectedZone;
      const matchesArea = selectedArea === 'all' || lot.area === selectedArea;
      return matchesSearch && matchesZone && matchesArea;
    });
    if (userLocation) {
      result.sort((a, b) => a.distMeters - b.distMeters);
    }
    return result;
  }, [lotsWithDistance, searchQuery, selectedZone, selectedArea, userLocation]);

  const handleStartNavigation = async (lot: ParkingLotData) => {
    if (!userLocation) {
      await onRequestUserLocation();
    }
    onStartNavigation(lot);
  };

  return (
    <div className="flex flex-col h-full bg-[#08153b] text-slate-100 p-3 sm:p-4 max-w-md mx-auto font-sans overflow-hidden">
      {/* Search & Filter Header */}
      <div className="space-y-2.5 mb-3 shrink-0">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#ffd700]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.parkingList.searchPlaceholder}
            className="w-full bg-[#050d27] border border-[#d4af37]/40 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#ffd700] transition-all shadow-inner"
          />
        </div>

        {/* Locate Me Banner */}
        {!userLocation && (
          <button
            onClick={onRequestUserLocation}
            className="w-full py-2 px-3 bg-gradient-to-r from-[#102a70] to-[#1e3a8b] border border-[#d4af37]/50 rounded-xl text-xs font-bold text-[#ffd700] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg cursor-pointer"
          >
            <Locate className="w-4 h-4 animate-bounce text-[#ffd700]" />
            <span>{t.parkingList.locateClosest}</span>
          </button>
        )}

        {/* Zone Filter Chips */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          <button
            onClick={() => setSelectedZone('all')}
            className={`py-1.5 px-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center truncate ${
              selectedZone === 'all'
                ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#040e26] shadow-md'
                : 'bg-[#0b1a45] text-slate-300 border border-[#d4af37]/30 hover:border-[#d4af37]'
            }`}
          >
            {t.parkingList.allZones}
          </button>
          <button
            onClick={() => setSelectedZone('0')}
            className={`py-1.5 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center truncate ${
              selectedZone === '0'
                ? 'bg-red-600 text-white border-red-400 shadow-md'
                : 'bg-[#0b1a45] border-red-500/40 text-red-400'
            }`}
          >
            Zona 0
          </button>
          <button
            onClick={() => setSelectedZone('1')}
            className={`py-1.5 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center truncate ${
              selectedZone === '1'
                ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                : 'bg-[#0b1a45] border-sky-500/40 text-sky-400'
            }`}
          >
            Zona 1
          </button>
          <button
            onClick={() => setSelectedZone('2')}
            className={`py-1.5 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center truncate ${
              selectedZone === '2'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : 'bg-[#0b1a45] border-emerald-500/40 text-emerald-400'
            }`}
          >
            Zona 2
          </button>
        </div>
      </div>

      {/* Parking Lot Cards Container - Smooth Native Scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar touch-pan-y space-y-3 pb-24 overscroll-contain">
        {filteredLots.length === 0 ? (
          <div className="text-center py-10 bg-[#0b1a45] border border-slate-700/50 rounded-2xl p-6">
            <Car className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300">{t.parkingList.noResults}</p>
          </div>
        ) : (
          filteredLots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const borderLeftColor =
              lot.zone === '0'
                ? 'border-l-4 border-red-500'
                : lot.zone === '1'
                ? 'border-l-4 border-sky-500'
                : 'border-l-4 border-emerald-500';
            const zoneTextColor =
              lot.zone === '0'
                ? 'text-red-400'
                : lot.zone === '1'
                ? 'text-sky-300'
                : 'text-emerald-300';

            return (
              <div
                key={lot.id}
                className={`p-3.5 rounded-2xl bg-gradient-to-r from-[#0b1a45] to-[#0f245e] ${borderLeftColor} border-y border-r border-[#d4af37]/20 hover:border-[#d4af37]/60 cursor-pointer transition-all shadow-xl relative group ${
                  isSelected ? 'ring-2 ring-[#ffd700] bg-[#122a6d]' : ''
                }`}
              >
                {/* Top Row: Name, Zone Badge & Price */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold uppercase ${zoneTextColor}`}>
                        {t.parkingList.zoneLabel} {lot.zone} • {lot.area}
                      </span>
                      {lot.isGarage && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300">
                          {t.parkingList.garage}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white mt-0.5 leading-snug">
                      {lot.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#d4af37]">
                      {lot.hourlyPrice.toFixed(1)}{' '}
                      <span className="text-[10px] font-normal text-slate-400">KM/h</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t.parkingList.dayPrice}: {lot.dailyPrice.toFixed(1)} KM
                    </div>
                  </div>
                </div>

                {/* Address & Distance */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0 text-[#d4af37]" />
                    <span className="truncate">{lot.address}</span>
                  </span>
                  {userLocation && lot.distMeters > 0 && (
                    <span className="shrink-0 text-[#d4af37] font-mono text-[11px] ml-2">
                      {formatDistance(lot.distMeters)}
                    </span>
                  )}
                </div>

                {/* Features Tags */}
                <div className="flex items-center gap-1 flex-wrap mb-2.5">
                  {lot.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#0a1128] border border-slate-700/60 text-[10px] text-slate-300"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid gap-2 pt-2 border-t grid-cols-3 border-slate-700/40">
                  <button
                    onClick={() => onSelectLot(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#0a1128] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    <span>{t.parkingList.mapButton}</span>
                  </button>
                  <button
                    onClick={() => handleStartNavigation(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#14213d] hover:bg-[#1f2e52] border border-[#d4af37]/30 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Compass className="w-3 h-3 text-[#d4af37]" />
                    <span>{t.parkingList.routeButton}</span>
                  </button>
                  <button
                    onClick={() => onPaySms(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#d4af37] hover:bg-[#b8860b] text-[#0a1128] font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 fill-current" />
                    <span>{t.parkingList.paySmsButton}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
