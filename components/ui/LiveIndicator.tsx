// components/ui/LiveIndicator.tsx
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Colors, Spacing } from '../../constants/theme'

interface LiveIndicatorProps {
  label?: string
}

export default function LiveIndicator({ label = 'Live Updates' }: LiveIndicatorProps) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(2.2, { duration: 700 }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    )
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 700 }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    )
  }, [])

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.dotWrapper}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dotWrapper: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.success,
    position: 'absolute',
  },
  ring: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.success,
    position: 'absolute',
  },
  label: {
    color: Colors.status.success,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
