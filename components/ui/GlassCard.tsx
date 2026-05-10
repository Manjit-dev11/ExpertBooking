// components/ui/GlassCard.tsx
import React from 'react'
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors, Radius, Shadow } from '../../constants/theme'

interface GlassCardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  intensity?: number
  disableAnimation?: boolean
}

export default function GlassCard({
  children,
  style,
  onPress,
  disableAnimation = false,
}: GlassCardProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (!disableAnimation && onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 })
    }
  }

  const handlePressOut = () => {
    if (!disableAnimation && onPress) {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 })
    }
  }

  const content = (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    )
  }

  return content
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
    ...Shadow.card,
  },
})
