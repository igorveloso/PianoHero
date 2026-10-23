// src/store/gameStore.ts
import { create } from 'zustand';
import { AccuracyLevel } from '@/design/tokens';

export interface FallingNote {
  id: string;
  note: number;
  startTime: number;
  duration: number;
  targetTime: number; // when it should be hit
  hit: boolean;
  missed: boolean;
  accuracy?: AccuracyLevel;
}

export interface NoteResult {
  note: number;
  accuracy: AccuracyLevel;
  deviation: number; // ms
  timestamp: number;
}

export interface GameState {
  // Exercise state
  exerciseId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsed: number;

  // Scoring
  score: number;
  streak: number;
  maxStreak: number;
  results: NoteResult[];

  // Notes
  fallingNotes: FallingNote[];
  activeKeys: Set<number>; // currently pressed keys

  // Note performance tracking
  noteErrors: Record<number, number>; // note → error count

  // Actions
  startExercise: (id: string) => void;
  pauseExercise: () => void;
  resumeExercise: () => void;
  endExercise: () => void;
  reset: () => void;

  spawnNote: (note: FallingNote) => void;
  pressKey: (midiNote: number, timestamp: number) => AccuracyLevel | null;
  releaseKey: (midiNote: number) => void;
  tickElapsed: (elapsed: number) => void;
  markMissed: (noteId: string) => void;
}

const SCORE_MAP: Record<AccuracyLevel, number> = {
  perfect: 100,
  good: 60,
  ok: 30,
  miss: 0,
};

const TIMING_WINDOWS = { perfect: 80, good: 150, ok: 250 };

export const useGameStore = create<GameState>((set, get) => ({
  exerciseId: null,
  isPlaying: false,
  isPaused: false,
  startTime: null,
  elapsed: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  results: [],
  fallingNotes: [],
  activeKeys: new Set(),
  noteErrors: {},

  startExercise: (id) => set({
    exerciseId: id,
    isPlaying: true,
    isPaused: false,
    startTime: Date.now(),
    elapsed: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    results: [],
    fallingNotes: [],
    activeKeys: new Set(),
    noteErrors: {},
  }),

  pauseExercise: () => set({ isPaused: true, isPlaying: false }),

  resumeExercise: () => set({ isPaused: false, isPlaying: true }),

  endExercise: () => set({ isPlaying: false }),

  reset: () => set({
    exerciseId: null, isPlaying: false, isPaused: false,
    startTime: null, elapsed: 0, score: 0, streak: 0,
    maxStreak: 0, results: [], fallingNotes: [],
    activeKeys: new Set(), noteErrors: {},
  }),

  spawnNote: (note) => set((s) => ({
    fallingNotes: [...s.fallingNotes, note],
  })),

  pressKey: (midiNote, timestamp) => {
    const { fallingNotes, streak, maxStreak, score, results, noteErrors } = get();

    // Find closest unhit note matching this MIDI note
    const candidates = fallingNotes.filter(
      n => n.note === midiNote && !n.hit && !n.missed
    );
    if (!candidates.length) return null;

    const closest = candidates.reduce((a, b) =>
      Math.abs(a.targetTime - timestamp) < Math.abs(b.targetTime - timestamp) ? a : b
    );

    const deviation = timestamp - closest.targetTime;
    const abs = Math.abs(deviation);

    let accuracy: AccuracyLevel;
    if (abs <= TIMING_WINDOWS.perfect)     accuracy = 'perfect';
    else if (abs <= TIMING_WINDOWS.good)   accuracy = 'good';
    else if (abs <= TIMING_WINDOWS.ok)     accuracy = 'ok';
    else                                    accuracy = 'miss';

    const newStreak = accuracy !== 'miss' ? streak + 1 : 0;
    const newScore = score + SCORE_MAP[accuracy] + (accuracy === 'perfect' ? newStreak * 5 : 0);
    const newErrors = accuracy === 'miss' || accuracy === 'ok'
      ? { ...noteErrors, [midiNote]: (noteErrors[midiNote] ?? 0) + 1 }
      : noteErrors;

    set((s) => ({
      score: newScore,
      streak: newStreak,
      maxStreak: Math.max(maxStreak, newStreak),
      results: [...results, { note: midiNote, accuracy, deviation, timestamp }],
      noteErrors: newErrors,
      activeKeys: new Set([...s.activeKeys, midiNote]),
      fallingNotes: s.fallingNotes.map(n =>
        n.id === closest.id ? { ...n, hit: true, accuracy } : n
      ),
    }));

    return accuracy;
  },

  releaseKey: (midiNote) => set((s) => {
    const next = new Set(s.activeKeys);
    next.delete(midiNote);
    return { activeKeys: next };
  }),

  tickElapsed: (elapsed) => set({ elapsed }),

  markMissed: (noteId) => set((s) => ({
    streak: 0,
    noteErrors: (() => {
      const n = s.fallingNotes.find(n => n.id === noteId);
      if (!n) return s.noteErrors;
      return { ...s.noteErrors, [n.note]: (s.noteErrors[n.note] ?? 0) + 1 };
    })(),
    fallingNotes: s.fallingNotes.map(n =>
      n.id === noteId ? { ...n, missed: true } : n
    ),
  })),
}));
