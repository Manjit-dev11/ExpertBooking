// components/common/FilterChips.tsx
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors, Gradients, Radius, Spacing } from '../../constants/theme'

interface FilterChipsProps {
  categories: string[]
  activeCategory: string
  onSelect: (category: string) => void
}

function Chip({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = async () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 })
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 })
    }, 80)
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) } catch {}
    onPress()
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        {isActive ? (
          <LinearGradient
            colors={Gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chip}
          >
            <Text style={[styles.chipText, styles.activeText]}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.chip, styles.inactiveChip]}>
            <Text style={[styles.chipText, styles.inactiveText]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

export default function FilterChips({ categories, activeCategory, onSelect }: FilterChipsProps) {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={{ width: Spacing.sm }} />}
      renderItem={({ item }) => (
        <Chip
          label={item}
          isActive={activeCategory === item}
          onPress={() => onSelect(item)}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveChip: {
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.text.primary,
  },
  inactiveText: {
    color: Colors.text.secondary,
  },
})
