
import { useState, useCallback, useEffect } from 'react';
import { navAudio, NavInstruction } from '../utils/navAudio';

export function useNavAudio() {
  const [muted, setMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      navAudio.setMuted(next);
      return next;
    });
  }, []);

  const play = useCallback((instruction: NavInstruction) => {
    navAudio.play(instruction);
  }, []);

  const enqueue = useCallback((...instructions: NavInstruction[]) => {
    navAudio.enqueue(...instructions);
  }, []);

  const cancel = useCallback(() => {
    navAudio.cancel();
  }, []);

  const preload = useCallback(() => {
    navAudio.preload();
  }, []);

  return { muted, toggleMute, play, enqueue, cancel, preload };
}
