// components/expert/CategoryBadge.tsx
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '../../constants/categories'
import { Radius, Spacing } from '../../constants/theme'

interface CategoryBadgeProps {
  category: string
  style?: ViewStyle
  showEmoji?: boolean
}

export default function CategoryBadge({ category, style, showEmoji = false }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['All']
  const emoji = CATEGORY_EMOJI[category] ?? ''

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {showEmoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.text, { color: colors.text }]}>{category}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  emoji: {
    fontSize: 11,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
})
