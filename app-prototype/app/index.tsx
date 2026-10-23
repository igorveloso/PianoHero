// app/index.tsx
import React, { useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet,
  ScrollView, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withRepeat,
  withSequence, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/design/tokens';
import { EXERCISES } from '@/data/exercises';

const { width: W } = Dimensions.get('window');

// 88 piano notes: A0(21) to C8(108)
const ALL_NOTES = Array.from({ length: 88 }, (_, i) => i + 21);
const BLACK_POS = new Set([1, 3, 6, 8, 10]);
const isBlack = (m: number) => BLACK_POS.has(m % 12);

// Mock mastery levels for display
const mockMastery = (note: number): string => {
  if (note < 48) return 'unseen';
  if (note < 56) return 'introduced';
  if (note < 64) return 'learning';
  if (note < 68) return 'consolidating';
  if (note < 72) return 'mastered';
  return 'unseen';
};

const STAR_COLORS: Record<string, string> = {
  unseen:        Colors.starUnseen,
  introduced:    Colors.starIntroduced,
  learning:      Colors.starLearning,
  consolidating: Colors.starConsolidating,
  mastered:      Colors.starMastered,
  expert:        Colors.starExpert,
};

function ConstellationStar({ note, index }: { note: number; index: number }) {
  const mastery = mockMastery(note);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withDelay(index * 8, withTiming(1, { duration: 400 }));
    scale.value = withDelay(index * 8, withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) }));

    if (mastery === 'mastered' || mastery === 'learning') {
      setTimeout(() => {
        opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1800 }),
            withTiming(0.55, { duration: 1800 }),
          ), -1, true
        );
      }, index * 8 + 600);
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const size = mastery === 'mastered' ? 10
    : mastery === 'consolidating' ? 8
    : mastery === 'learning' ? 7
    : mastery === 'introduced' ? 5
    : 3;

  const color = STAR_COLORS[mastery];
  const black = isBlack(note);

  return (
    <Animated.View style={[animStyle, {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      marginTop: black ? -4 : 0,
      shadowColor: color,
      shadowOpacity: mastery !== 'unseen' ? 0.8 : 0,
      shadowRadius: mastery === 'mastered' ? 6 : 3,
    }]} />
  );
}

function ExerciseCard({ id }: { id: string }) {
  const ex = EXERCISES[id];
  if (!ex) return null;
  const diffDots = Array.from({ length: 5 }, (_, i) => i < ex.difficulty);

  return (
    <Pressable
      style={({ pressed }) => [styles.exCard, pressed && styles.exCardPressed]}
      onPress={() => router.push({ pathname: '/exercise', params: { id } })}
    >
      <View style={styles.exHeader}>
        <Text style={styles.exTitle}>{ex.title}</Text>
        <View style={styles.diffRow}>
          {diffDots.map((filled, i) => (
            <View key={i} style={[styles.diffDot, filled && styles.diffDotFilled]} />
          ))}
        </View>
      </View>
      {ex.composer && <Text style={styles.exComposer}>{ex.composer}</Text>}
      <Text style={styles.exDesc} numberOfLines={2}>{ex.description}</Text>
      <View style={styles.exFooter}>
        <Text style={styles.exTag}>{ex.hands === 'right' ? 'Mão direita' : ex.hands === 'left' ? 'Mão esquerda' : 'Duas mãos'}</Text>
        <Text style={styles.exTag}>{ex.bpm} BPM</Text>
        <Text style={[styles.exTag, { color: Colors.gold }]}>Iniciar →</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Piano Hero</Text>
          <Text style={styles.appSub}>Seu universo musical</Text>
        </View>

        {/* Constellation */}
        <View style={styles.constellationSection}>
          <Text style={styles.sectionLabel}>Suas notas</Text>
          <View style={styles.constellation}>
            {ALL_NOTES.map((note, i) => (
              <View key={note} style={styles.starWrapper}>
                <ConstellationStar note={note} index={i} />
              </View>
            ))}
          </View>
          <Text style={styles.constellationCaption}>
            {ALL_NOTES.filter(n => mockMastery(n) === 'mastered').length} notas dominadas · {ALL_NOTES.length} total
          </Text>
        </View>

        {/* Current exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Continuar de onde parou</Text>
          <ExerciseCard id="M1" />
        </View>

        {/* All exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Todos os exercícios</Text>
          {Object.keys(EXERCISES).map(id => (
            <ExerciseCard key={id} id={id} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  appName: {
    fontFamily: Fonts.displayBlack,
    fontSize: 36,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  appSub: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  constellationSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontFamily: Fonts.bodySemibold,
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  constellation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A1A28',
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (W - 48 - 40) / 22 - 5,
    height: 14,
  },
  constellationCaption: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  exCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E1E2A',
  },
  exCardPressed: {
    borderColor: Colors.goldDim,
    backgroundColor: Colors.bgElevated,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  exTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  diffDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.textMuted,
  },
  diffDotFilled: {
    backgroundColor: Colors.gold,
  },
  exComposer: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.gold,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  exDesc: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  exFooter: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  exTag: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textMuted,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
