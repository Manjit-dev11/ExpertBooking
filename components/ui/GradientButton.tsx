// components/ui/GradientButton.tsx
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Colors, Gradients, Radius, Shadow, Spacing } from '../../constants/theme'

interface GradientButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: ViewStyle
  ghost?: boolean
}

const sizeMap = {
  sm: { height: 38, fontSize: 13, paddingHorizontal: 16 },
  md: { height: 48, fontSize: 15, paddingHorizontal: 24 },
  lg: { height: 56, fontSize: 17, paddingHorizontal: 32 },
}

export default function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  size = 'md',
  style,
  ghost = false,
}: GradientButtonProps) {
  const scale = useSharedValue(1)
  const { height, fontSize, paddingHorizontal } = sizeMap[size]

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = async () => {
    if (disabled || loading) return
    scale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    )
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {}
    onPress()
  }

  if (ghost) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          onPress={handlePress}
          style={[
            styles.ghostButton,
            { height, paddingHorizontal },
            disabled && styles.disabled,
          ]}
        >
          <Text style={[styles.ghostLabel, { fontSize }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[animatedStyle, style, !disabled && Shadow.glow]}>
      <Pressable onPress={handlePress} disabled={disabled || loading}>
        <LinearGradient
          colors={disabled ? ['#333333', '#444444'] : Gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            { height, paddingHorizontal },
            disabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text.primary} size="small" />
          ) : (
            <Text style={[styles.label, { fontSize }]}>{label}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  label: {
    color: Colors.text.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ghostButton: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.active,
  },
  ghostLabel: {
    color: Colors.accent.primary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
})
