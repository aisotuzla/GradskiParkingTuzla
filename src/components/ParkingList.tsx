import React, { useState, useMemo } from 'react';
import { Search, MapPin, Navigation, MessageSquare, Car, Zap, Shield, CheckCircle, Compass, Locate } from 'lucide-react';
import { Language, ParkingLotData, ParkingZone, UserLocation } from '../types';
import { ZONE_DETAILS } from '../data/parkingData';
import { TRANSLATIONS } from '../data/translations';
import { calculateDistanceMeters, formatDistance } from '../services/routingService';

interface ParkingListProps {
  parkingLots: ParkingLotData[];
  selectedLot: ParkingLotData | null;
  onSelectLot: (lot: ParkingLotData) => void;
  onPaySms: (lot: ParkingLotData) => void;
  onStartNavigation: (lot: ParkingLotData) => void;
  userLocation: UserLocation | null;
  onRequestUserLocation: () => void;
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

  const uniqueAreas = useMemo(() => {
    const areas = new Set(parkingLots.map((l) => l.area));
    return Array.from(areas);
  }, [parkingLots]);

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
    let result = lotsWithDistance.filter((lot) => {
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

  return (
    <div className="flex flex-col h-full bg-[#0a1128] text-slate-100 p-3 sm:p-4 max-w-md mx-auto pb-24">
      {/* Search and Filter Header */}
      <div className="space-y-2.5 mb-3">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.parkingList.searchPlaceholder}
            className="w-full bg-[#0a1128] border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37] transition-all"
          />
        </div>

        {/* Locate Me Banner */}
        {!userLocation && (
          <button
            onClick={onRequestUserLocation}
            className="w-full py-2 px-3 bg-[#1a2a44] border border-[#d4af37]/30 rounded-lg text-xs font-semibold text-[#d4af37] flex items-center justify-center gap-2 hover:bg-[#253755] transition-colors shadow-md"
          >
            <Locate className="w-4 h-4 animate-bounce text-[#d4af37]" />
            <span>{t.parkingList.locateClosest}</span>
          </button>
        )}

        {/* Zone Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedZone === 'all'
                ? 'bg-[#d4af37] text-[#0a1128] shadow-md'
                : 'bg-[#14213d] text-slate-400 border border-[#d4af37]/20 hover:border-[#d4af37]/50'
            }`}
          >
            {t.parkingList.allZones}
          </button>
          <button
            onClick={() => setSelectedZone('0')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border transition-all ${
              selectedZone === '0'
                ? 'bg-red-500 text-white border-red-400 shadow-md'
                : 'bg-[#14213d] border-red-500/30 text-red-400'
            }`}
          >
            {t.zones.zone0}
          </button>
          <button
            onClick={() => setSelectedZone('1')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border transition-all ${
              selectedZone === '1'
                ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                : 'bg-[#14213d] border-blue-500/30 text-blue-400'
            }`}
          >
            {t.zones.zone1}
          </button>
          <button
            onClick={() => setSelectedZone('2')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border transition-all ${
              selectedZone === '2'
                ? 'bg-green-500 text-white border-green-400 shadow-md'
                : 'bg-[#14213d] border-green-500/30 text-green-400'
            }`}
          >
            {t.zones.zone2}
          </button>
        </div>
      </div>

      {/* Parking Lot Cards */}
      <div className="space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
        {filteredLots.length === 0 ? (
          <div className="text-center py-10 bg-[#14213d] border border-slate-700/50 rounded-xl p-6">
            <Car className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300">{t.parkingList.noResults}</p>
          </div>
        ) : (
          filteredLots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;

            const borderLeftColor =
              lot.zone === '0'
                ? 'border-l-4 border-l-red-500'
                : lot.zone === '1'
                  ? 'border-l-4 border-l-blue-500'
                  : lot.zone === '2'
                    ? 'border-l-4 border-l-green-500'
                    : '';

            const zoneTextColor =
              lot.zone === '0'
                ? 'text-red-500'
                : lot.zone === '1'
                  ? 'text-blue-400'
                  : lot.zone === '2'
                    ? 'text-green-400'
                    : 'text-slate-400';

            return (
              <div
                key={lot.id}
                className={`p-3.5 rounded-lg ${borderLeftColor} hover:bg-[#253755] cursor-pointer transition-all shadow-md relative group ${
                  isSelected ? 'ring-1 ring-[#d4af37] bg-[#253755]' : 'bg-[#1a2a44]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold uppercase ${zoneTextColor}`}>
                        {t.timer.zone} {lot.zone} &bull; {t.common.area}: {lot.area}
                      </span>
                      {lot.isGarage && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300">
                          {t.parkingList.garage}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white mt-0.5 leading-snug">{lot.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#d4af37]">
                      {lot.hourlyPrice.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">KM/h</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{lot.dailyPrice.toFixed(1)} {t.zones.pricePerDay}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">{lot.address}</span>
                  </span>
                  {userLocation && lot.distMeters > 0 && (
                    <span className="shrink-0 text-[#d4af37] font-mono text-[11px] ml-2">
                      {formatDistance(lot.distMeters)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-wrap mb-2.5">
                  {lot.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#0a1128] border border-slate-700/60 text-[10px] text-slate-300"
                    >
                      {feat}
                    </span>
                  ))}
                  {lot.capacity && (
                    <span className="px-2 py-0.5 rounded bg-[#0a1128] border border-slate-700/60 text-[10px] text-slate-400">
                      ~{lot.capacity} {t.parkingList.spaces}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/40">
                  <button
                    onClick={() => onSelectLot(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#0a1128] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    <span>{t.tabs.map}</span>
                  </button>
                  <button
                    onClick={() => onStartNavigation(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#14213d] hover:bg-[#1f2e52] border border-[#d4af37]/30 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Compass className="w-3 h-3 text-[#d4af37]" />
                    <span>{t.navigation.navigate}</span>
                  </button>
                  <button
                    onClick={() => onPaySms(lot)}
                    className="py-1.5 px-2 rounded-md bg-[#d4af37] hover:bg-[#b8860b] text-[#0a1128] font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3 h-3 fill-current" />
                    <span>{t.tabs.pay}</span>
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
