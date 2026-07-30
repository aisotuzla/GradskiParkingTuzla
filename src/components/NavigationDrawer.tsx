import React, { useState, useEffect, useCallback } from 'react';
import { X, Navigation, Compass, ArrowUp, ArrowLeft, ArrowRight, CheckCircle2, WifiOff, Clock, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { Language, NavigationRoute, ParkingLotData } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatDistance, formatDuration } from '../services/routingService';

interface NavigationDrawerProps {
  route: NavigationRoute | null;
  onStopNavigation: () => void;
  onPaySmsForLot: (lot: ParkingLotData) => void;
  currentLang: Language;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  route,
  onStopNavigation,
  onPaySmsForLot,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpokenInitial, setHasSpokenInitial] = useState(false);

  // Speech synthesis helper for Bosnian / Croatian voice navigation
  const speakInstruction = useCallback(
    (text: string) => {
      if (isMuted || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      // Search for Bosnian (bs), Croatian (hr), or Serbian (sr) voice
      const localVoice = voices.find(
        (v) => v.lang.startsWith('bs') || v.lang.startsWith('hr') || v.lang.startsWith('sr')
      );

      if (localVoice) {
        utterance.voice = localVoice;
        utterance.lang = localVoice.lang;
      } else {
        utterance.lang = currentLang === 'bs' ? 'bs-BA' : currentLang === 'de' ? 'de-DE' : 'en-US';
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted, currentLang]
  );

  // Announce route start when drawer appears
  useEffect(() => {
    if (route && !hasSpokenInitial) {
      const initialText =
        currentLang === 'bs'
          ? `Započinjem navigaciju prema ${route.targetLot.name}. Udaljenost ${formatDistance(route.distance)}.`
          : `Starting navigation to ${route.targetLot.name}. Distance ${formatDistance(route.distance)}.`;

      speakInstruction(initialText);
      setHasSpokenInitial(true);
    }
  }, [route, hasSpokenInitial, currentLang, speakInstruction]);

  // Reset initial spoken flag when target changes or stops
  useEffect(() => {
    setHasSpokenInitial(false);
  }, [route?.targetLot?.id]);

  if (!route) return null;

  const { targetLot, distance, duration, steps, isOffline } = route;

  const renderStepIcon = (action?: string) => {
    switch (action) {
      case 'turn-left':
        return <ArrowLeft className="w-5 h-5 text-[#D4AF37]" />;
      case 'turn-right':
        return <ArrowRight className="w-5 h-5 text-[#D4AF37]" />;
      case 'arrive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <ArrowUp className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis?.cancel();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      speakInstruction(`Glasovna navigacija uključena.`);
    }
  };

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-2 pointer-events-auto animate-slide-up">
      <div className="bg-[#1a2a44] border border-[#d4af37]/40 rounded-2xl p-4 shadow-2xl text-slate-100">
        {/* Header Row: Target Name, Voice Toggle & Close */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-700/50 pb-2.5 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0a1128] border border-[#d4af37]/50 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#d4af37] animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                  {t.navigation.title}
                </span>
                {isOffline && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                    <WifiOff className="w-2.5 h-2.5" />
                    Offline
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-sm text-white truncate max-w-[170px]">
                {targetLot.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Voice Navigation Audio Toggle */}
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-bold ${
                !isMuted
                  ? 'bg-[#d4af37] text-[#0a1128] border-[#d4af37]'
                  : 'bg-[#0a1128] text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isMuted ? 'Uključi glasovnu navigaciju' : 'Isključi glasovnu navigaciju'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                onStopNavigation();
              }}
              className="p-1.5 rounded-full bg-[#0a1128] text-slate-400 hover:text-white transition-colors border border-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Distance & Time Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#0a1128] border border-[#d4af37]/30 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {t.navigation.distance}
            </span>
            <span className="text-lg font-black text-[#d4af37] font-mono">{formatDistance(distance)}</span>
          </div>

          <div className="bg-[#0a1128] border border-[#d4af37]/30 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {t.navigation.estTime}
            </span>
            <span className="text-lg font-black text-white font-mono">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Turn-by-turn steps list (Clickable for spoken prompt) */}
        <div className="max-h-36 overflow-y-auto space-y-2 mb-3 pr-1 custom-scrollbar">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                const textToSpeak = `${step.instruction} ${
                  step.distance > 0 ? `za ${formatDistance(step.distance)}` : ''
                }`;
                speakInstruction(textToSpeak);
              }}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg bg-[#14213d] border border-slate-700/50 hover:border-[#d4af37]/40 text-xs text-slate-200 transition-colors active:scale-98"
            >
              <div className="p-1 rounded-md bg-[#0a1128] border border-slate-700/60 shrink-0 mt-0.5">
                {renderStepIcon(step.action)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100">{step.instruction}</p>
                {step.distance > 0 && (
                  <span className="text-[10px] text-[#d4af37] font-mono">
                    za {formatDistance(step.distance)}
                  </span>
                )}
              </div>
              <Volume2 className="w-3.5 h-3.5 text-[#d4af37]/60 shrink-0 self-center" />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onStopNavigation();
            }}
            className="py-2.5 px-3 rounded-lg bg-[#0a1128] border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            {t.navigation.stopNav}
          </button>

          <button
            onClick={() => onPaySmsForLot(targetLot)}
            className="py-2.5 px-3 rounded-lg bg-[#d4af37] text-[#0a1128] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#b8860b] active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Stigao sam - SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
