// components/ui/Badge.tsx
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Colors, Radius, Spacing } from '../../constants/theme'

type BadgeVariant = 'success' | 'warning' | 'error' | 'pending' | 'info' | 'default'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  style?: ViewStyle
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: { bg: Colors.status.successBg, text: Colors.status.success, dot: Colors.status.success },
  warning: { bg: Colors.status.warningBg, text: Colors.status.warning, dot: Colors.status.warning },
  error: { bg: Colors.status.errorBg, text: Colors.status.error, dot: Colors.status.error },
  pending: { bg: Colors.status.pendingBg, text: Colors.status.pending, dot: Colors.status.pending },
  info: { bg: 'rgba(99,102,241,0.15)', text: '#818CF8', dot: '#818CF8' },
  default: { bg: Colors.bg.card, text: Colors.text.secondary, dot: Colors.text.muted },
}

export default function Badge({ label, variant = 'default', style }: BadgeProps) {
  const colors = variantMap[variant]

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[styles.label, { color: colors.text }]}>{label.toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
})
