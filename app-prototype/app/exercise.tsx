// app/exercise.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/design/tokens';
import { EXERCISES } from '@/data/exercises';
import { useGameStore } from '@/store/gameStore';
import { startEngine, stopEngine } from '@/engine/exerciseEngine';
import { useMIDI } from '@/hooks/useMIDI';

import { HUD } from '@/components/HUD';
import { NoteRail } from '@/components/NoteRail';
import { PianoKeyboard } from '@/components/PianoKeyboard';
import { ResultScreen } from '@/components/ResultScreen';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showResult, setShowResult] = useState(false);
  const isPlaying = useGameStore(s => s.isPlaying);
  const reset = useGameStore(s => s.reset);

  // Connect MIDI events to game store
  useMIDI();

  const exercise = EXERCISES[id ?? 'M1'];

  useEffect(() => {
    if (!exercise) { router.back(); return; }

    // Small delay so screen is mounted
    const t = setTimeout(() => {
      startEngine(exercise);
    }, 800);

    return () => {
      clearTimeout(t);
      stopEngine();
      reset();
    };
  }, [exercise?.id]);

  // Watch for exercise end
  useEffect(() => {
    if (!isPlaying && useGameStore.getState().results.length > 0) {
      const t = setTimeout(() => setShowResult(true), 600);
      return () => clearTimeout(t);
    }
  }, [isPlaying]);

  const handleReplay = useCallback(() => {
    setShowResult(false);
    reset();
    setTimeout(() => startEngine(exercise), 400);
  }, [exercise]);

  const handleNext = useCallback(() => {
    // For now, go back to home
    router.replace('/');
  }, []);

  if (!exercise) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />
      <SafeAreaView style={styles.screen} edges={['top']}>

        {/* HUD */}
        <HUD bpm={exercise.bpm} title={exercise.title} />

        {/* Main play area */}
        <View style={styles.playArea}>
          {/* Background gradient lines */}
          <View style={styles.topFade} />
          <View style={styles.bottomFade} />

          {/* Falling notes rail */}
          <NoteRail />
        </View>

        {/* Piano keyboard — always at bottom */}
        <PianoKeyboard />

        {/* Result overlay */}
        {showResult && (
          <ResultScreen
            exerciseTitle={exercise.title}
            passingAccuracy={exercise.passingAccuracy}
            onReplay={handleReplay}
            onNext={handleNext}
          />
        )}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  playArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.bgBase,
  },
  topFade: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 80,
    zIndex: 3,
    // Simulated gradient with solid color fade
    backgroundColor: Colors.bgBase + 'CC',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 40,
    zIndex: 3,
    backgroundColor: Colors.bgBase + 'BB',
  },
});
