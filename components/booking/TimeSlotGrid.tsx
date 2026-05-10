// components/booking/TimeSlotGrid.tsx
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import TimeSlotBadge from './TimeSlotBadge'
import { Spacing } from '../../constants/theme'

interface Slot {
  date: string
  time: string
  isBooked: boolean
}

interface TimeSlotGridProps {
  slots: Slot[]
  selectedSlot: string | null
  onSelect: (time: string) => void
}

export default function TimeSlotGrid({ slots, selectedSlot, onSelect }: TimeSlotGridProps) {
  return (
    <FlatList
      data={slots}
      keyExtractor={(item) => `${item.date}-${item.time}`}
      numColumns={3}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <TimeSlotBadge
            time={item.time}
            isBooked={item.isBooked}
            isSelected={selectedSlot === item.time}
            onPress={() => onSelect(item.time)}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
  },
})
