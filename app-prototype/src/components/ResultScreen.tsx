// src/components/ResultScreen.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withTiming,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/design/tokens';
import { useGameStore } from '@/store/gameStore';
import { midiToDisplay } from '@/data/exercises';
import { router } from 'expo-router';

interface Props {
  exerciseTitle: string;
  passingAccuracy: number;
  onReplay: () => void;
  onNext: () => void;
}

export function ResultScreen({ exerciseTitle, passingAccuracy, onReplay, onNext }: Props) {
  const { results, score, maxStreak, noteErrors } = useGameStore();

  const totalNotes = results.length;
  const correctNotes = results.filter(r => r.accuracy !== 'miss').length;
  const accuracy = totalNotes > 0 ? Math.round((correctNotes / totalNotes) * 100) : 0;
  const passed = accuracy >= passingAccuracy;

  const avgDeviation = totalNotes > 0
    ? Math.round(results.reduce((s, r) => s + Math.abs(r.deviation), 0) / totalNotes)
    : 0;

  // Top errors
  const topErrors = Object.entries(noteErrors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([note, count]) => ({ note: parseInt(note), count }));

  // Entry animation
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);

  React.useEffect(() => {
    cardY.value = withSpring(0, { damping: 18, stiffness: 200 });
    cardOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.statusIcon}>{passed ? '✓' : '○'}</Text>
          <Text style={styles.statusText}>
            {passed ? 'Exercício concluído' : 'Continue praticando'}
          </Text>
        </View>

        {/* Big accuracy number */}
        <View style={styles.accuracyBlock}>
          <Text style={[styles.accuracyNum, { color: passed ? Colors.hit : Colors.ok }]}>
            {accuracy}%
          </Text>
          <Text style={styles.accuracyLabel}>Precisão</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Stat label="Timing médio" value={`${avgDeviation}ms`} />
          <Stat label="Streak máx." value={`×${maxStreak}`} />
          <Stat label="Score" value={score.toString()} />
        </View>

        {/* Note errors */}
        {topErrors.length > 0 && (
          <View style={styles.errorsBlock}>
            <Text style={styles.errorsTitle}>Notas para trabalhar:</Text>
            {topErrors.map(({ note, count }) => (
              <View key={note} style={styles.errorRow}>
                <View style={styles.noteDot} />
                <Text style={styles.errorNote}>{midiToDisplay(note)}</Text>
                <Text style={styles.errorCount}>{count}× errada</Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.replayBtn} onPress={onReplay}>
            <Text style={styles.replayText}>Repetir</Text>
          </Pressable>
          <Pressable style={[styles.nextBtn, passed && styles.nextBtnPassed]} onPress={onNext}>
            <Text style={[styles.nextText, passed && styles.nextTextPassed]}>
              {passed ? 'Próximo →' : 'Tentar novamente →'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bgBase + 'EE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.bgElevated,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.goldDim + '60',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  statusIcon: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    color: Colors.hit,
  },
  statusText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  accuracyBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  accuracyNum: {
    fontFamily: Fonts.displayBlack,
    fontSize: 72,
    lineHeight: 76,
    letterSpacing: -2,
  },
  accuracyLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#2A2A3A',
    marginBottom: 20,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  errorsBlock: {
    marginBottom: 24,
  },
  errorsTitle: {
    fontFamily: Fonts.bodySemibold,
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.ok,
  },
  errorNote: {
    fontFamily: Fonts.monoMedium,
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  errorCount: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  replayBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.goldDim,
    alignItems: 'center',
  },
  replayText: {
    fontFamily: Fonts.bodySemibold,
    fontSize: 15,
    color: Colors.gold,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    alignItems: 'center',
  },
  nextBtnPassed: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  nextText: {
    fontFamily: Fonts.bodySemibold,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  nextTextPassed: {
    color: Colors.bgBase,
  },
});
