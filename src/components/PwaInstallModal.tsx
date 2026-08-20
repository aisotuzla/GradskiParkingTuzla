import React from 'react';
import { X, Download, Smartphone, Laptop, Share, PlusSquare, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredInstallPrompt: any;
  onNativeInstall: () => void;
  currentLang: Language;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredInstallPrompt,
  onNativeInstall,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang];

  const handleInstallClick = () => {
    if (deferredInstallPrompt) {
      onNativeInstall();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0b1e4f] via-[#09183d] to-[#040e26] border border-[#d4af37]/60 rounded-2xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#9a7b1c] text-[#040e26] flex items-center justify-center font-extrabold shadow-lg shadow-[#d4af37]/20 border border-[#fff5c0]/50">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg gold-gradient-text uppercase tracking-wide leading-tight">
                {t.pwa.installTitle}
              </h2>
              <p className="text-[11px] text-slate-300 font-medium">
                https://gradskiparkingtuzla.vercel.app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#0b1a45] text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Description */}
        <p className="text-xs text-slate-200 mb-4 leading-relaxed bg-[#051330] p-3 rounded-xl border border-[#d4af37]/30">
          {t.pwa.installPrompt}
        </p>

        {/* Native Install Button (if browser prompt is ready) */}
        {deferredInstallPrompt && (
          <button
            onClick={handleInstallClick}
            className="w-full mb-5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#040e26] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all border border-[#fff5c0]/50 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{t.pwa.installButton}</span>
          </button>
        )}

        {/* Device Step-by-Step Instructions */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
            {t.pwa.howToInstall}
          </span>

          {/* iOS Safari */}
          <div className="p-3 rounded-xl bg-[#081b3f] border border-slate-700/70 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <span>{t.pwa.iosInstructionsTitle}</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 pl-6">
              <p className="flex items-center gap-1.5">
                <Share className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>1. {t.pwa.iosInstructionsStep1}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <PlusSquare className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>2. {t.pwa.iosInstructionsStep2}</span>
              </p>
            </div>
          </div>

          {/* Android Chrome */}
          <div className="p-3 rounded-xl bg-[#081b3f] border border-slate-700/70 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{t.pwa.androidInstructionsTitle}</span>
            </div>
            <p className="text-[11px] text-slate-300 pl-6 flex items-start gap-1.5">
              <MoreVertical className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.pwa.androidInstructionsStep1}</span>
            </p>
          </div>

          {/* Desktop Chrome / Edge */}
          <div className="p-3 rounded-xl bg-[#081b3f] border border-slate-700/70 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>{t.pwa.desktopInstructionsTitle}</span>
            </div>
            <p className="text-[11px] text-slate-300 pl-6 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{t.pwa.desktopInstructionsStep1}</span>
            </p>
          </div>
        </div>

        {/* Modal Footer Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-[#051330] border border-slate-700 text-slate-300 font-bold text-xs hover:bg-[#091f4a] transition-colors"
        >
          {t.pwa.close}
        </button>
      </div>
    </div>
  );
};
