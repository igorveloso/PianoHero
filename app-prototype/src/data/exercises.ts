// src/data/exercises.ts

export interface NoteEvent {
  time: number;   // ms from start
  note: number;   // MIDI note number
  duration: number; // ms
  finger?: number;
}

export interface Exercise {
  id: string;
  title: string;
  composer?: string;
  description: string;
  pedagogyNote: string;
  bpm: number;
  timeSignature: [number, number];
  hands: 'right' | 'left' | 'both';
  genre: 'classical' | 'mpb' | 'pop' | 'game';
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  passingAccuracy: number;
  focusNotes: number[];
  notes: NoteEvent[];
}

// BPM 72 → beat = 833ms → quarter note = 833ms
const BPM = 72;
const BEAT = (60 / BPM) * 1000;
const Q = BEAT;       // quarter note
const H = BEAT * 2;   // half note
const E = BEAT / 2;   // eighth note

// MIDI notes
const C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71, C5=72;
const C3=48, G3=55, E3=52, F3=53;

export const EXERCISES: Record<string, Exercise> = {

  'M1': {
    id: 'M1',
    title: 'Ode à Alegria',
    composer: 'Beethoven',
    description: 'A melodia mais reconhecível do mundo. Só notas brancas, mão direita.',
    pedagogyNote: 'A mudança E→F no compasso 1 é onde iniciantes tropeçam mais. Dedos 3→4.',
    bpm: BPM,
    timeSignature: [4, 4],
    hands: 'right',
    genre: 'classical',
    difficulty: 1,
    prerequisites: [],
    passingAccuracy: 80,
    focusNotes: [F4, D4],
    notes: [
      // Compasso 1: E E F G
      { time: 0,        note: E4, duration: Q * 0.9 },
      { time: Q,        note: E4, duration: Q * 0.9 },
      { time: Q * 2,    note: F4, duration: Q * 0.9 },
      { time: Q * 3,    note: G4, duration: Q * 0.9 },
      // Compasso 2: G F E D
      { time: Q * 4,    note: G4, duration: Q * 0.9 },
      { time: Q * 5,    note: F4, duration: Q * 0.9 },
      { time: Q * 6,    note: E4, duration: Q * 0.9 },
      { time: Q * 7,    note: D4, duration: Q * 0.9 },
      // Compasso 3: C C D E
      { time: Q * 8,    note: C4, duration: Q * 0.9 },
      { time: Q * 9,    note: C4, duration: Q * 0.9 },
      { time: Q * 10,   note: D4, duration: Q * 0.9 },
      { time: Q * 11,   note: E4, duration: Q * 0.9 },
      // Compasso 4: E. D D
      { time: Q * 12,   note: E4, duration: H * 0.9 },
      { time: Q * 14,   note: D4, duration: H * 0.9 },
      // Compasso 5: E E F G
      { time: Q * 16,   note: E4, duration: Q * 0.9 },
      { time: Q * 17,   note: E4, duration: Q * 0.9 },
      { time: Q * 18,   note: F4, duration: Q * 0.9 },
      { time: Q * 19,   note: G4, duration: Q * 0.9 },
      // Compasso 6: G F E D
      { time: Q * 20,   note: G4, duration: Q * 0.9 },
      { time: Q * 21,   note: F4, duration: Q * 0.9 },
      { time: Q * 22,   note: E4, duration: Q * 0.9 },
      { time: Q * 23,   note: D4, duration: Q * 0.9 },
      // Compasso 7: C C D E
      { time: Q * 24,   note: C4, duration: Q * 0.9 },
      { time: Q * 25,   note: C4, duration: Q * 0.9 },
      { time: Q * 26,   note: D4, duration: Q * 0.9 },
      { time: Q * 27,   note: E4, duration: Q * 0.9 },
      // Compasso 8: D. C C
      { time: Q * 28,   note: D4, duration: H * 0.9 },
      { time: Q * 30,   note: C4, duration: H * 0.9 },
    ],
  },

  'C1': {
    id: 'C1',
    title: 'Encontre o Dó',
    description: 'O Dó central (C4) é sua âncora. Encontre ele 5 vezes.',
    pedagogyNote: 'C4 é a nota de referência. Usuário deve memorizar posição antes de qualquer outra.',
    bpm: 60,
    timeSignature: [4, 4],
    hands: 'right',
    genre: 'classical',
    difficulty: 1,
    prerequisites: [],
    passingAccuracy: 100,
    focusNotes: [C4],
    notes: [
      { time: 0,      note: C4, duration: 800 },
      { time: 1500,   note: C4, duration: 800 },
      { time: 3000,   note: C4, duration: 800 },
      { time: 4500,   note: C4, duration: 800 },
      { time: 6000,   note: C4, duration: 800 },
    ],
  },

  'R1': {
    id: 'R1',
    title: 'Quatro Tempos',
    description: 'Toque o Dó 4 vezes, uma por tempo. Simples e no tempo.',
    pedagogyNote: 'Erros de timing revelam falta de pulso interno. Se errar >20%, o tempo é rápido demais.',
    bpm: 60,
    timeSignature: [4, 4],
    hands: 'right',
    genre: 'classical',
    difficulty: 1,
    prerequisites: ['C1'],
    passingAccuracy: 80,
    focusNotes: [C4],
    notes: Array.from({ length: 8 }, (_, i) => ({
      time: i * 1000,
      note: C4,
      duration: 800,
    })),
  },
};

// Note name lookup
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const midiToName = (note: number): string => {
  const octave = Math.floor(note / 12) - 1;
  return `${NOTE_NAMES[note % 12]}${octave}`;
};

export const midiToDisplay = (note: number): string => {
  const names: Record<number, string> = {
    60: 'Dó', 62: 'Ré', 64: 'Mi', 65: 'Fá',
    67: 'Sol', 69: 'Lá', 71: 'Si', 72: 'Dó',
  };
  return names[note] ?? midiToName(note);
};
