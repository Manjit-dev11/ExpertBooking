// components/booking/TimeSlotBadge.tsx
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors, Gradients, Radius, Spacing } from '../../constants/theme'

interface TimeSlotBadgeProps {
  time: string
  isBooked: boolean
  isSelected: boolean
  onPress: () => void
}

export default function TimeSlotBadge({ time, isBooked, isSelected, onPress }: TimeSlotBadgeProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = async () => {
    if (isBooked) return
    scale.value = withSpring(0.92, { damping: 15 })
    setTimeout(() => {
      scale.value = withSpring(isSelected ? 1 : 1.05, { damping: 10, stiffness: 200 })
    }, 80)
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) } catch {}
    onPress()
  }

  if (isBooked) {
    return (
      <View style={[styles.badge, styles.booked]}>
        <Text style={[styles.time, styles.bookedText]}>{time}</Text>
        <Text style={styles.takenLabel}>Taken</Text>
      </View>
    )
  }

  if (isSelected) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={Gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.badge, styles.selected]}
          >
            <Text style={[styles.time, styles.selectedText]}>{time}</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        <View style={[styles.badge, styles.available]}>
          <Text style={[styles.time]}>{time}</Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  available: {
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  selected: {
    borderWidth: 0,
  },
  booked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  time: {
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.text.primary,
    fontWeight: '700',
  },
  bookedText: {
    color: Colors.text.muted,
    textDecorationLine: 'line-through',
    fontSize: 11,
  },
  takenLabel: {
    color: Colors.status.error,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
})
