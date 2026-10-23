// src/components/HUD.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSequence, withTiming, withSpring,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/design/tokens';
import { useGameStore } from '@/store/gameStore';
import { router } from 'expo-router';
import { pauseEngine } from '@/engine/exerciseEngine';

export function HUD({ bpm, title }: { bpm: number; title: string }) {
  const score = useGameStore(s => s.score);
  const streak = useGameStore(s => s.streak);
  const prevScore = React.useRef(score);

  const scoreBump = useSharedValue(1);

  React.useEffect(() => {
    if (score !== prevScore.current) {
      scoreBump.value = withSequence(
        withSpring(1.2, { damping: 6, stiffness: 400 }),
        withTiming(1, { duration: 120 }),
      );
      prevScore.current = score;
    }
  }, [score]);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreBump.value }],
  }));

  const streakColor = streak >= 20 ? Colors.gold
    : streak >= 10 ? Colors.goldBright
    : streak >= 5  ? Colors.hit
    : Colors.textSecondary;

  return (
    <View style={styles.hud}>
      {/* Left: score */}
      <Animated.Text style={[styles.score, scoreStyle]}>
        {score.toString().padStart(5, '0')}
      </Animated.Text>

      {/* Center: title + BPM */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.bpm}>{bpm} BPM</Text>
      </View>

      {/* Right: streak + exit */}
      <View style={styles.right}>
        {streak > 0 && (
          <Text style={[styles.streak, { color: streakColor }]}>
            ×{streak}
          </Text>
        )}
        <Pressable
          onPress={() => { pauseEngine(); router.back(); }}
          style={styles.exitBtn}
          hitSlop={12}
        >
          <Text style={styles.exitText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    height: 56,
    backgroundColor: Colors.bgBase,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1A1A28',
  },
  score: {
    fontFamily: Fonts.monoMedium,
    fontSize: 24,
    color: Colors.gold,
    letterSpacing: -0.5,
    minWidth: 80,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 13,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  bpm: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  streak: {
    fontFamily: Fonts.monoMedium,
    fontSize: 18,
  },
  exitBtn: {
    padding: 4,
  },
  exitText: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    color: Colors.textMuted,
  },
});
