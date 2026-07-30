import React, { useState, useEffect, useRef } from 'react';
import { NavigationRoute, RouteStep } from '../types';

interface NavigationHUDProps {
  route: NavigationRoute | null;
  onClose: () => void;
}

const NavigationHUD: React.FC<NavigationHUDProps> = ({ route, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const dragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const step = route?.steps[currentIndex];

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  const handleNext = () => {
    if (!route) return;
    const nextIdx = Math.min(currentIndex + 1, route.steps.length - 1);
    setCurrentIndex(nextIdx);
  };

  const handlePrev = () => {
    if (!route) return;
    const prevIdx = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIdx);
  };

  // Play audio automatically when step changes
  useEffect(() => {
    if (!step) return;
    const action = step.action;
    // Map action to audio filename, e.g., "turn-right" => "turn-right.mp3"
    const audioFile = `/audio/${action}.mp3`;
    playAudio(audioFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!route) return null;

  return (
    <div
      ref={hudRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        background: '#040675',
        color: '#d4af37',
        padding: '12px',
        borderRadius: '8px',
        zIndex: 1000,
        minWidth: '200px',
        cursor: 'move',
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <strong>Navigation</strong>
        <button onClick={onClose} className="text-xs text-[#d4af37] hover:text-[#f8fafc]">
          ✕
        </button>
      </div>
      {step && (
        <div className="mb-2">
          <p className="text-sm">{step.instruction}</p>
          <p className="text-xs opacity-75">{Math.round(step.distance)} m • {Math.round(step.time / 60)} min</p>
        </div>
      )}
      <div className="flex space-x-2 justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-2 py-1 bg-[#08224d] rounded hover:bg-[#0a1128] disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= route.steps.length - 1}
          className="px-2 py-1 bg-[#08224d] rounded hover:bg-[#0a1128] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NavigationHUD;
