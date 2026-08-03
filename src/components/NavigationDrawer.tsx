import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Compass,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  WifiOff,
  MessageSquare,
  Volume2,
  VolumeX
} from 'lucide-react';

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
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [hasSpokenInitial, setHasSpokenInitial] = useState(false);

  const dragRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });


  const speakInstruction = useCallback(
    (text: string) => {

      if (
        isMuted ||
        !('speechSynthesis' in window)
      ) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();

      const voice =
        voices.find(
          v =>
            v.lang.startsWith(currentLang) &&
            /male/i.test(v.name)
        ) ||
        voices.find(
          v => v.lang.startsWith(currentLang)
        );

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang =
          currentLang === 'bs'
            ? 'bs-BA'
            : currentLang === 'de'
              ? 'de-DE'
              : 'en-US';
      }

      utterance.rate = 0.95;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, currentLang]
  );


  /*
    DRAG SYSTEM
    MUST stay above return.
  */

  const onMouseMove = useCallback((e: MouseEvent) => {

    if (!dragging.current) return;

    setDragPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });

  }, []);


  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);


  useEffect(() => {

    window.addEventListener(
      'mousemove',
      onMouseMove
    );

    window.addEventListener(
      'mouseup',
      onMouseUp
    );


    return () => {

      window.removeEventListener(
        'mousemove',
        onMouseMove
      );

      window.removeEventListener(
        'mouseup',
        onMouseUp
      );

    };

  }, [onMouseMove, onMouseUp]);



  useEffect(() => {

    if (!route) return;

    if (!hasSpokenInitial) {

      const text =
        currentLang === 'bs'
          ? `Započinjem navigaciju prema ${route.targetLot.name}. Udaljenost ${formatDistance(route.distance)}.`
          : `Starting navigation to ${route.targetLot.name}. Distance ${formatDistance(route.distance)}.`;


      speakInstruction(text);

      setHasSpokenInitial(true);
    }

  }, [
    route,
    hasSpokenInitial,
    currentLang,
    speakInstruction
  ]);



  useEffect(() => {

    setHasSpokenInitial(false);

  }, [route?.targetLot?.id]);



  useEffect(() => {

    return () => {
      window.speechSynthesis?.cancel();
    };

  }, []);



  const onMouseDown = (
    e: React.MouseEvent
  ) => {

    dragging.current = true;

    const rect =
      dragRef.current?.getBoundingClientRect();


    if (rect) {

      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

    }

    e.stopPropagation();

  };



  const toggleMute = () => {

    if (!isMuted) {

      window.speechSynthesis?.cancel();

      setIsMuted(true);

    } else {

      setIsMuted(false);

      speakInstruction(
        currentLang === 'bs'
          ? 'Glasovna navigacija uključena'
          : 'Voice navigation enabled'
      );

    }

  };



  const renderStepIcon = (
    action?: string
  ) => {

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



  /*
     NOW SAFE.
     All hooks already executed.
  */

  if (!route) return null;



  const {
    targetLot,
    distance,
    duration,
    steps,
    isOffline
  } = route;



  return (

    <div
      ref={dragRef}
      onMouseDown={onMouseDown}
      style={{
        left: dragPos.x,
        top: dragPos.y,
        position: 'fixed'
      }}
      className="
        fixed
        left-0
        right-0
        max-w-md
        mx-auto
        px-3
        pb-2
        pointer-events-auto
        animate-slide-up
      "
    >

      <div className="
        bg-[#1a2a44]
        border
        border-[#d4af37]/40
        rounded-2xl
        p-4
        shadow-2xl
        text-slate-100
      ">


        <div className="
          flex
          justify-between
          border-b
          border-slate-700/50
          pb-2
          mb-3
        ">

          <div className="flex gap-3">

            <Compass className="text-[#d4af37]" />

            <div>

              <span className="text-xs text-[#d4af37]">
                {t.navigation.title}
              </span>

              <h3 className="font-bold">
                {targetLot.name}
              </h3>

              {isOffline &&
                <WifiOff className="w-4 h-4 text-yellow-400" />
              }

            </div>

          </div>


          <button
            onClick={toggleMute}
          >
            {
              isMuted
                ?
                <VolumeX />
                :
                <Volume2 />
            }
          </button>


          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onStopNavigation();
            }}
          >
            <X />
          </button>


        </div>



        <div className="grid grid-cols-2 gap-2">

          <div>
            {formatDistance(distance)}
          </div>

          <div>
            {formatDuration(duration)}
          </div>

        </div>



        <div className="max-h-36 overflow-auto">

          {steps.map((step, index) => (

            <button
              key={index}
              onClick={() =>
                speakInstruction(step.instruction)
              }
              className="
              w-full
              flex
              gap-2
              p-2
              text-left
            "
            >

              {renderStepIcon(step.action)}

              {step.instruction}

            </button>

          ))}

        </div>



        <div className="grid grid-cols-2 gap-2 mt-3">

          <button
            onClick={onStopNavigation}
          >
            {t.navigation.stopNav}
          </button>


          <button
            onClick={() =>
              onPaySmsForLot(targetLot)
            }
          >
            <MessageSquare className="inline" />
            SMS
          </button>


        </div>


      </div>


    </div>

  );

};