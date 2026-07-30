import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Navigation, MessageSquare, MapPin } from 'lucide-react';
import { Language, ParkingLotData } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface VoiceAssistantProps {
  currentLang: Language;
  onFindClosestParking: () => ParkingLotData | null;
  onStartPayment: () => void;
  onSwitchTab?: (tab: 'map' | 'list' | 'timer' | 'vehicles') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  currentLang,
  onFindClosestParking,
  onStartPayment,
  onSwitchTab,
  isOpen,
  onClose,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  // Check speech recognition browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang =
          currentLang === 'bs' ? 'bs-BA' : currentLang === 'de' ? 'de-DE' : 'en-US';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [currentLang]
  );

  const processCommand = useCallback(
    (text: string) => {
      const lower = text.toLowerCase().trim();
      setTranscript(text);

      // Match Closest Parking intent
      if (
        lower.includes('najbliž') ||
        lower.includes('najbliz') ||
        lower.includes('closest') ||
        lower.includes('nächster') ||
        lower.includes('naechster') ||
        lower.includes('nearest') ||
        lower.includes('potraži') ||
        lower.includes('potrazi') ||
        lower.includes('pronađi') ||
        lower.includes('pronadji')
      ) {
        const lot = onFindClosestParking();
        if (lot) {
          const msg =
            currentLang === 'bs'
              ? `Pronađen najbliži parking: ${lot.name}. Pokrećem navigaciju.`
              : currentLang === 'de'
              ? `Nächstgelegener Parkplatz gefunden: ${lot.name}. Navigation gestartet.`
              : `Found closest parking: ${lot.name}. Starting navigation.`;
          setStatusMessage(msg);
          speak(msg);
        } else {
          const msg =
            currentLang === 'bs'
              ? 'Tražim najbliži parking...'
              : 'Searching for closest parking...';
          setStatusMessage(msg);
        }
        return;
      }

      // Match Start Payment / SMS intent
      if (
        lower.includes('plati') ||
        lower.includes('platiparking') ||
        lower.includes('payment') ||
        lower.includes('bezahlen') ||
        lower.includes('sms') ||
        lower.includes('paziti') ||
        lower.includes('platil') ||
        lower.includes('kupikartu')
      ) {
        onStartPayment();
        const msg =
          currentLang === 'bs'
            ? 'Otvaram SMS plaćanje parkinga.'
            : currentLang === 'de'
            ? 'Öffne SMS-Parkzahlung.'
            : 'Opening SMS parking payment.';
        setStatusMessage(msg);
        speak(msg);
        return;
      }

      // Match Map view intent
      if (
        lower.includes('mapa') ||
        lower.includes('karta') ||
        lower.includes('map') ||
        lower.includes('karte')
      ) {
        if (onSwitchTab) onSwitchTab('map');
        const msg =
          currentLang === 'bs'
            ? 'Otvaram kartu.'
            : currentLang === 'de'
            ? 'Karte wird geöffnet.'
            : 'Opening map.';
        setStatusMessage(msg);
        speak(msg);
        return;
      }

      // Match List view intent
      if (
        lower.includes('lista') ||
        lower.includes('list') ||
        lower.includes('parkinzi') ||
        lower.includes('svi')
      ) {
        if (onSwitchTab) onSwitchTab('list');
        const msg =
          currentLang === 'bs'
            ? 'Otvaram listu parkirališta.'
            : currentLang === 'de'
            ? 'Parkplatzliste geöffnet.'
            : 'Opening parking list.';
        setStatusMessage(msg);
        speak(msg);
        return;
      }

      // Unrecognized command
      const fallbackMsg =
        currentLang === 'bs'
          ? `Prepoznato: "${text}". Pokušajte reći "Najbliži parking" ili "Plati parking".`
          : currentLang === 'de'
          ? `Erkannt: "${text}". Versuchen Sie "Nächster Parkplatz" oder "Bezahlen".`
          : `Recognized: "${text}". Try saying "Closest parking" or "Start payment".`;
      setStatusMessage(fallbackMsg);
      speak(fallbackMsg);
    },
    [currentLang, onFindClosestParking, onStartPayment, onSwitchTab, speak]
  );

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        currentLang === 'bs' ? 'bs-BA' : currentLang === 'de' ? 'de-DE' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setStatusMessage(
          currentLang === 'bs'
            ? 'Slušam... Recite vašu komandu.'
            : currentLang === 'de'
            ? 'Ich höre zu... Sprechen Sie Ihren Befehl.'
            : 'Listening... Speak your command.'
        );
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        if (event.results[0].isFinal) {
          setIsListening(false);
          processCommand(currentText);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        setStatusMessage(
          currentLang === 'bs'
            ? 'Glasovno prepoznavanje nije uspjelo. Pokušajte ponovo.'
            : 'Speech recognition failed. Please try again.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Recognition error:', e);
      setIsListening(false);
    }
  }, [currentLang, processCommand]);

  // Auto-start listening when modal is opened
  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
    } else if (!isOpen) {
      window.speechSynthesis?.cancel();
    }
  }, [isOpen, isSupported, startListening]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0a1128] border border-[#d4af37]/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37] text-[#0a1128] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#d4af37] uppercase tracking-wide">
                {t.voice?.title || 'Glasovne Komande'}
              </h2>
              <p className="text-[11px] text-slate-300">
                {t.voice?.subtitle || 'Glasovni asistent za parking'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1a2a44] text-slate-400 hover:text-white transition-colors border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Pulse Button Display */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative mb-4">
            {/* Animated rings when listening */}
            {isListening && (
              <>
                <span className="absolute -inset-3 rounded-full bg-[#d4af37]/20 animate-ping"></span>
                <span className="absolute -inset-6 rounded-full bg-[#d4af37]/10 animate-pulse"></span>
              </>
            )}

            <button
              onClick={startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-[#d4af37] text-[#0a1128] shadow-[#d4af37]/40'
                  : 'bg-[#1a2a44] text-[#d4af37] border-2 border-[#d4af37]/50 hover:border-[#d4af37]'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Live Transcript / Status */}
          <div className="min-h-[60px] flex flex-col items-center justify-center px-4 w-full">
            {transcript && (
              <p className="text-sm font-bold text-white mb-1 italic font-mono bg-[#14213d] px-3 py-1.5 rounded-lg border border-slate-700/60 max-w-full truncate">
                "{transcript}"
              </p>
            )}

            <p className="text-xs font-semibold text-[#d4af37]">
              {statusMessage ||
                (isListening
                  ? t.voice?.listening || 'Slušam...'
                  : t.voice?.tapToSpeak || 'Pritisnite mikrofon i izgovorite komandu')}
            </p>
          </div>
        </div>

        {/* Suggested Quick Commands */}
        <div className="border-t border-slate-700/50 pt-4 mt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {t.voice?.suggestedCommands || 'Brze komande (Izgovorite ili dodirnite):'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const lot = onFindClosestParking();
                if (lot) {
                  const msg = `Pronađen najbliži parking: ${lot.name}`;
                  setStatusMessage(msg);
                  speak(msg);
                }
              }}
              className="p-2.5 rounded-xl bg-[#14213d] border border-slate-700/60 hover:border-[#d4af37]/50 flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">"Najbliži parking"</span>
                <span className="text-[10px] text-slate-400">Pronađi & Navigiraj</span>
              </div>
            </button>

            <button
              onClick={() => {
                onStartPayment();
                setStatusMessage('Otvaram SMS plaćanje...');
              }}
              className="p-2.5 rounded-xl bg-[#14213d] border border-slate-700/60 hover:border-[#d4af37]/50 flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">"Plati parking"</span>
                <span className="text-[10px] text-slate-400">SMS Plaćanje</span>
              </div>
            </button>
          </div>
        </div>

        {!isSupported && (
          <p className="text-[10px] text-amber-400 text-center mt-3">
            Preglednik ne podržava automatsko prepoznavanje govora, ali možete koristiti dugmad za brze komande iznad.
          </p>
        )}
      </div>
    </div>
  );
};
