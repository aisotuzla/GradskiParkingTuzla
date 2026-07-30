import React, { useState } from 'react';
import { Car, Plus, Trash2, Shield, Info, Check, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ZONE_DETAILS } from '../data/parkingData';
import { formatPlateDisplay, getSavedPlates, savePlate } from '../services/smsService';

interface VehicleManagerProps {
  currentLang: Language;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [plates, setPlates] = useState<string[]>(getSavedPlates());
  const [newPlate, setNewPlate] = useState<string>('');

  const handleAddPlate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    savePlate(newPlate);
    setPlates(getSavedPlates());
    setNewPlate('');
  };

  const handleDeletePlate = (plateToDelete: string) => {
    const updated = plates.filter((p) => p !== plateToDelete);
    localStorage.setItem('tuzla_saved_plates_v1', JSON.stringify(updated));
    setPlates(updated);
  };

  return (
    <div className="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-24 text-slate-100">
      {/* Saved Vehicles Card */}
      <div className="bg-[#1a2a44] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3 mb-3 border-b border-slate-700/50 pb-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#0a1128] flex items-center justify-center font-bold shadow-sm">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#d4af37] uppercase tracking-wide">Moja Vozila / Tablice</h3>
            <p className="text-[11px] text-slate-300">Spremljene registarske oznake za brže SMS plaćanje</p>
          </div>
        </div>

        {/* Add Plate Form */}
        <form onSubmit={handleAddPlate} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
            placeholder="Npr. A12-K-345"
            className="flex-1 bg-[#0a1128] border border-[#d4af37]/40 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#d4af37]"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#d4af37] text-[#0a1128] rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-[#b8860b] active:scale-95 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj</span>
          </button>
        </form>

        {/* List of Saved Plates */}
        <div className="space-y-2">
          {plates.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Nema spremljenih tablica.</p>
          ) : (
            plates.map((p) => (
              <div
                key={p}
                className="flex items-center justify-between bg-[#14213d] p-3 rounded-lg border border-slate-700/60 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                  <span className="font-extrabold font-mono tracking-wider text-[#d4af37]">
                    {formatPlateDisplay(p)}
                  </span>
                </div>

                <button
                  onClick={() => handleDeletePlate(p)}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  title="Obriši"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tariff & Zone Reference Table Card */}
      <div className="bg-[#1a2a44] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3 mb-3 border-b border-slate-700/50 pb-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0a1128] border border-[#d4af37]/50 text-[#d4af37] flex items-center justify-center font-bold">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#d4af37] uppercase tracking-wide">Cjenovnik & Brojevi Zona</h3>
            <p className="text-[11px] text-slate-300">JKP Saobraćaj i komunikacije Tuzla</p>
          </div>
        </div>

        <div className="space-y-2">
          {Object.values(ZONE_DETAILS).map((zone) => (
            <div
              key={zone.zone}
              className="p-3 bg-[#14213d] rounded-lg border border-slate-700/60 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs uppercase text-[#d4af37]">
                  {zone.name}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Sat: <span className="font-bold text-white">{zone.hourlyPrice.toFixed(1)} KM</span> •
                  Dan: <span className="font-bold text-white">{zone.dailyPrice.toFixed(1)} KM</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">SMS Broj</span>
                <span className="text-xs font-black font-mono text-[#d4af37] bg-[#0a1128] px-2 py-1 rounded-md border border-slate-700/60">
                  {zone.shortCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
