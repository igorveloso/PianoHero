// src/components/PianoKeyboard.tsx
import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { Colors } from '@/design/tokens';
import { midiEngine } from '@/engine/midi';
import { useGameStore } from '@/store/gameStore';

const { width: SCREEN_W } = Dimensions.get('window');

// 2 octaves: C4–B5 (MIDI 60–83)
const START_NOTE = 60;
const END_NOTE   = 83;
const TOTAL_KEYS = END_NOTE - START_NOTE + 1;

// Which positions (0-based within octave) are black keys
const BLACK_POSITIONS = new Set([1, 3, 6, 8, 10]);

interface KeyInfo {
  midi: number;
  isBlack: boolean;
  whiteIndex: number; // position among white keys
}

function buildKeys(): KeyInfo[] {
  const keys: KeyInfo[] = [];
  let whiteIndex = 0;
  for (let midi = START_NOTE; midi <= END_NOTE; midi++) {
    const pos = midi % 12;
    const isBlack = BLACK_POSITIONS.has(pos);
    keys.push({ midi, isBlack, whiteIndex: isBlack ? whiteIndex - 1 : whiteIndex });
    if (!isBlack) whiteIndex++;
  }
  return keys;
}

const KEYS = buildKeys();
const WHITE_KEYS = KEYS.filter(k => !k.isBlack);
const WHITE_KEY_W = Math.floor(SCREEN_W / WHITE_KEYS.length);
const WHITE_KEY_H = 120;
const BLACK_KEY_W = Math.floor(WHITE_KEY_W * 0.6);
const BLACK_KEY_H = 76;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PianoKeyProps {
  keyInfo: KeyInfo;
  isActive: boolean;
  isHighlighted: boolean;
  accuracy?: string;
}

function PianoKey({ keyInfo, isActive, isHighlighted, accuracy }: PianoKeyProps) {
  const { midi, isBlack, whiteIndex } = keyInfo;
  const pressAnim = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    pressAnim.value = withTiming(1, { duration: 60, easing: Easing.out(Easing.quad) });
    midiEngine.emitVirtual(midi, 90);
  }, [midi]);

  const handlePressOut = useCallback(() => {
    pressAnim.value = withTiming(0, { duration: 100, easing: Easing.in(Easing.quad) });
    midiEngine.emitVirtual(midi, 0);
  }, [midi]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressAnim.value * (isBlack ? 2 : 3) }],
  }));

  const glowColor = accuracy === 'perfect' ? Colors.hit
    : accuracy === 'good' ? Colors.good
    : accuracy === 'ok' ? Colors.ok
    : isHighlighted ? Colors.gold
    : 'transparent';

  if (isBlack) {
    const left = whiteIndex * WHITE_KEY_W + WHITE_KEY_W - BLACK_KEY_W / 2;
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.blackKey, animStyle, {
          left,
          backgroundColor: isActive ? Colors.keyBlackPressed : Colors.keyBlack,
          shadowColor: glowColor,
          shadowOpacity: glowColor !== 'transparent' ? 0.9 : 0,
          shadowRadius: 12,
          elevation: 8,
        }]}
      />
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.whiteKey, animStyle, {
        left: whiteIndex * WHITE_KEY_W,
        backgroundColor: isActive ? Colors.keyWhitePressed : Colors.keyWhite,
        shadowColor: glowColor,
        shadowOpacity: glowColor !== 'transparent' ? 0.8 : 0,
        shadowRadius: 16,
        elevation: glowColor !== 'transparent' ? 6 : 2,
      }]}
    />
  );
}

export function PianoKeyboard() {
  const activeKeys = useGameStore(s => s.activeKeys);
  const results = useGameStore(s => s.results);

  const lastResultByNote = React.useMemo(() => {
    const map: Record<number, string> = {};
    results.slice(-10).forEach(r => { map[r.note] = r.accuracy; });
    return map;
  }, [results]);

  return (
    <View style={styles.container}>
      {/* White keys first (z-index lower) */}
      {WHITE_KEYS.map(k => (
        <PianoKey
          key={k.midi}
          keyInfo={k}
          isActive={activeKeys.has(k.midi)}
          isHighlighted={false}
          accuracy={lastResultByNote[k.midi]}
        />
      ))}
      {/* Black keys on top */}
      {KEYS.filter(k => k.isBlack).map(k => (
        <PianoKey
          key={k.midi}
          keyInfo={k}
          isActive={activeKeys.has(k.midi)}
          isHighlighted={false}
          accuracy={lastResultByNote[k.midi]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: WHITE_KEY_H + 8,
    position: 'relative',
    backgroundColor: '#080810',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3A',
  },
  whiteKey: {
    position: 'absolute',
    width: WHITE_KEY_W - 2,
    height: WHITE_KEY_H,
    bottom: 0,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2A2824',
  },
  blackKey: {
    position: 'absolute',
    width: BLACK_KEY_W,
    height: BLACK_KEY_H,
    bottom: WHITE_KEY_H - BLACK_KEY_H + 8,
    zIndex: 10,
    borderRadius: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
