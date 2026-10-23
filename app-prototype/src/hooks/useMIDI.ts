// src/hooks/useMIDI.ts
import { useEffect } from 'react';
import { midiEngine } from '@/engine/midi';
import { useGameStore } from '@/store/gameStore';

export function useMIDI() {
  const pressKey = useGameStore(s => s.pressKey);
  const releaseKey = useGameStore(s => s.releaseKey);
  const isPlaying = useGameStore(s => s.isPlaying);

  useEffect(() => {
    midiEngine.init();

    const remove = midiEngine.addListener((event) => {
      if (!isPlaying) return;

      if (event.type === 'noteOn' && event.note !== undefined) {
        pressKey(event.note, event.timestamp);
      } else if (event.type === 'noteOff' && event.note !== undefined) {
        releaseKey(event.note);
      }
    });

    return remove;
  }, [isPlaying, pressKey, releaseKey]);
}
