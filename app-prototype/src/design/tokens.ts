// src/design/tokens.ts
export const Colors = {
  // Backgrounds
  bgBase:      '#0A0A0F',
  bgSurface:   '#12121A',
  bgElevated:  '#1A1A28',

  // Piano keys
  keyWhite:    '#E8E4DC',
  keyWhitePressed: '#CCC8BE',
  keyBlack:    '#1C1C24',
  keyBlackPressed: '#2A2A38',
  keyBorder:   '#2A2824',

  // Accents
  gold:        '#C9A84C',
  goldBright:  '#E8C46A',
  goldDim:     '#6A5520',

  // Feedback
  hit:         '#4CFFB3',
  hitGlow:     '#4CFFB322',
  good:        '#4CC9FF',
  ok:          '#FFD166',
  miss:        '#FF4C6A',
  missGlow:    '#FF4C6A22',

  // Text
  textPrimary:   '#F0EDE8',
  textSecondary: '#8A8A9A',
  textMuted:     '#3A3A4A',

  // Stars
  starUnseen:        '#1E1E2A',
  starIntroduced:    '#3A3A5A',
  starLearning:      '#4C7FFF',
  starConsolidating: '#C0C0E0',
  starMastered:      '#C9A84C',
  starExpert:        '#FFE89A',
} as const;

export const Fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayBlack: 'PlayfairDisplay_900Black',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
  body: 'InstrumentSans_400Regular',
  bodySemibold: 'InstrumentSans_600SemiBold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Timing windows for note accuracy (ms)
export const TimingWindows = {
  perfect: 80,
  good:    150,
  ok:      250,
} as const;

export type AccuracyLevel = 'perfect' | 'good' | 'ok' | 'miss';
