// components/expert/RatingStars.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing } from '../../constants/theme'

interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export default function RatingStars({ rating, reviewCount, size = 'md' }: RatingStarsProps) {
  const fontSize = size === 'sm' ? 11 : 14

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: fontSize + 1 }}>⭐</Text>
      <Text style={[styles.rating, { fontSize }]}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: fontSize - 1 }]}>({reviewCount})</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    color: Colors.text.primary,
    fontWeight: '700',
  },
  count: {
    color: Colors.text.secondary,
    fontWeight: '400',
  },
})
