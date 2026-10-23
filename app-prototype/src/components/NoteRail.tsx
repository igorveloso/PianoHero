// src/components/NoteRail.tsx
import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, withSpring,
  runOnJS, Easing, FadeOut,
} from 'react-native-reanimated';
import { Colors } from '@/design/tokens';
import { useGameStore, FallingNote } from '@/store/gameStore';
import { NOTE_FALL_DURATION } from '@/engine/exerciseEngine';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Match keyboard: C4=60 to B5=83
const START_NOTE = 60;
const END_NOTE   = 83;
const TOTAL_NOTES = END_NOTE - START_NOTE + 1;

// Which positions are black keys (within octave)
const BLACK_POSITIONS = new Set([1, 3, 6, 8, 10]);
const isBlack = (midi: number) => BLACK_POSITIONS.has(midi % 12);

const WHITE_COUNT = Array.from({ length: TOTAL_NOTES }, (_, i) => i + START_NOTE)
  .filter(m => !isBlack(m)).length;
const WHITE_W = SCREEN_W / WHITE_COUNT;

// Get X position of a note's center
function noteX(midi: number): number {
  let whiteIdx = 0;
  for (let m = START_NOTE; m < midi; m++) {
    if (!isBlack(m)) whiteIdx++;
  }
  if (isBlack(midi)) {
    // Center over the gap between adjacent white keys
    return whiteIdx * WHITE_W + WHITE_W - (WHITE_W * 0.3);
  }
  return whiteIdx * WHITE_W + WHITE_W / 2;
}

// Note width
const noteW = (midi: number) => isBlack(midi) ? WHITE_W * 0.55 : WHITE_W - 4;

// Hit line position from top (85% down)
const HIT_LINE_Y = SCREEN_H * 0.62;

// Colors per accuracy
const ACCURACY_COLORS: Record<string, string> = {
  perfect: Colors.hit,
  good:    Colors.good,
  ok:      Colors.ok,
  miss:    Colors.miss,
};

interface FallingNoteViewProps {
  note: FallingNote;
}

function FallingNoteView({ note }: FallingNoteViewProps) {
  const y = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const glowOpacity = useSharedValue(0);

  const x = noteX(note.note);
  const w = noteW(note.note);
  const black = isBlack(note.note);

  useEffect(() => {
    // Spawn animation
    opacity.value = withTiming(1, { duration: 120 });
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });

    // Fall to hit line
    y.value = withTiming(HIT_LINE_Y, {
      duration: NOTE_FALL_DURATION,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });

    // Glow as it approaches
    setTimeout(() => {
      glowOpacity.value = withTiming(1, { duration: 400 });
    }, NOTE_FALL_DURATION * 0.6);
  }, []);

  useEffect(() => {
    if (note.hit) {
      // Hit animation — quick burst up
      scale.value = withSequence(
        withTiming(1.3, { duration: 80 }),
        withTiming(0, { duration: 150 }),
      );
      opacity.value = withTiming(0, { duration: 200 });
    }
    if (note.missed) {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [note.hit, note.missed]);

  const color = note.accuracy ? ACCURACY_COLORS[note.accuracy]
    : black ? '#3A3A6A' : Colors.hit;

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x - w / 2 },
      { translateY: y.value },
      { scaleX: scale.value },
      { scaleY: scale.value },
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.4,
  }));

  return (
    <Animated.View style={[styles.noteBase, animStyle, {
      width: w,
      height: black ? 52 : 68,
      backgroundColor: color + (note.hit ? 'AA' : '88'),
      borderColor: color,
      borderRadius: black ? 4 : 6,
      shadowColor: color,
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 6,
    }]}>
      {/* Inner glow */}
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle, {
        backgroundColor: color + '44',
        borderRadius: black ? 4 : 6,
      }]} />
    </Animated.View>
  );
}

export function NoteRail() {
  const fallingNotes = useGameStore(s => s.fallingNotes);

  return (
    <View style={styles.rail} pointerEvents="none">
      {/* Hit line */}
      <View style={[styles.hitLine, { top: HIT_LINE_Y }]} />

      {/* Vertical track guides */}
      {Array.from({ length: WHITE_COUNT }, (_, i) => (
        <View key={i} style={[styles.track, { left: i * WHITE_W, width: WHITE_W }]} />
      ))}

      {/* Notes */}
      {fallingNotes.map(note => (
        <FallingNoteView key={note.id} note={note} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  hitLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.gold + '60',
    zIndex: 5,
  },
  track: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#1A1A28',
  },
  noteBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
