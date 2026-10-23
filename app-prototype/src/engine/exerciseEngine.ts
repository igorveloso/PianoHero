// src/engine/exerciseEngine.ts
import { Exercise, NoteEvent } from '@/data/exercises';
import { useGameStore, FallingNote } from '@/store/gameStore';

// How long a note takes to fall to the hit line (ms)
// Adjustable — longer = more time to react
export const NOTE_FALL_DURATION = 2000;

// How far past the hit line before marking as missed (ms)
const MISS_GRACE = 300;

let _timer: ReturnType<typeof setInterval> | null = null;
let _startTime: number = 0;
let _exercise: Exercise | null = null;
let _spawnedIndices: Set<number> = new Set();

export function startEngine(exercise: Exercise) {
  stopEngine();
  _exercise = exercise;
  _spawnedIndices = new Set();
  _startTime = Date.now();

  const store = useGameStore.getState();
  store.startExercise(exercise.id);

  _timer = setInterval(() => {
    const now = Date.now();
    const elapsed = now - _startTime;
    store.tickElapsed(elapsed);

    // Spawn notes that are NOTE_FALL_DURATION ahead of their target time
    exercise.notes.forEach((noteEvent, idx) => {
      if (_spawnedIndices.has(idx)) return;
      const spawnAt = noteEvent.time - NOTE_FALL_DURATION;
      if (elapsed >= spawnAt) {
        _spawnedIndices.add(idx);
        const falling: FallingNote = {
          id: `${exercise.id}-${idx}-${now}`,
          note: noteEvent.note,
          startTime: now,
          duration: noteEvent.duration,
          targetTime: _startTime + noteEvent.time,
          hit: false,
          missed: false,
        };
        store.spawnNote(falling);
      }
    });

    // Mark notes as missed if they've passed the hit window
    const { fallingNotes, markMissed } = useGameStore.getState();
    fallingNotes.forEach(n => {
      if (!n.hit && !n.missed && now > n.targetTime + MISS_GRACE) {
        markMissed(n.id);
      }
    });

    // End exercise when all notes have been processed + buffer
    const lastNote = exercise.notes[exercise.notes.length - 1];
    if (elapsed > lastNote.time + 2000 && _spawnedIndices.size === exercise.notes.length) {
      stopEngine();
      store.endExercise();
    }
  }, 16); // ~60fps tick
}

export function stopEngine() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
}

export function pauseEngine() {
  stopEngine();
  useGameStore.getState().pauseExercise();
}
