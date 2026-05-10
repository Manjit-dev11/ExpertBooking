// components/booking/BookingStatusCard.tsx
import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { format } from 'date-fns'
import { Feather } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import { Booking } from '../../constants/mockData'
import { Colors, Radius, Spacing } from '../../constants/theme'

interface BookingStatusCardProps {
  booking: Booking
}

const statusVariantMap: Record<string, 'success' | 'pending' | 'default' | 'error'> = {
  confirmed: 'success',
  pending: 'pending',
  completed: 'default',
  cancelled: 'error',
}

const statusBgMap: Record<string, string> = {
  confirmed: 'rgba(0,212,170,0.04)',
  pending: 'rgba(255,149,0,0.04)',
  completed: 'rgba(255,255,255,0.02)',
  cancelled: 'rgba(255,69,0,0.04)',
}

export default function BookingStatusCard({ booking }: BookingStatusCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const height = useSharedValue(0)
  const opacity = useSharedValue(0)

  // Use the useBookings hook internally to get cancelBooking
  const { cancelBooking } = require('../../hooks/useBookings').useBookings()

  const toggleExpand = () => {
    if (expanded) {
      height.value = withTiming(0, { duration: 250 })
      opacity.value = withTiming(0, { duration: 200 })
    } else {
      // make it taller to fit the cancel button if needed
      const targetHeight = (booking.status === 'pending' || booking.status === 'confirmed') ? 160 : 110
      height.value = withTiming(targetHeight, { duration: 300 })
      opacity.value = withTiming(1, { duration: 300 })
    }
    setExpanded(!expanded)
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelBooking(booking._id)
      toggleExpand()
      Toast.show({
        type: 'success',
        text1: 'Session Cancelled',
        text2: 'Your session is cancelled successfully',
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsCancelling(false)
    }
  }

  const expandStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    overflow: 'hidden',
  }))

  const formattedDate = (() => {
    try {
      return format(new Date(booking.date), 'EEE, MMM d')
    } catch {
      return booking.date
    }
  })()

  const avatarUri = (booking.expertId as any)?.avatar || booking.expertAvatar
  const title = (booking.expertId as any)?.title || booking.expertTitle
  const rate = (booking.expertId as any)?.hourlyRate || booking.hourlyRate

  return (
    <GlassCard style={[styles.card, { backgroundColor: statusBgMap[booking.status] }]} disableAnimation>
      <View style={styles.accentBorder} />
      <View style={styles.content}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.expertName}>{booking.expertName}</Text>
            <Text style={styles.expertTitle} numberOfLines={1}>{title}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailRow}>
          <Text style={styles.detail}>📅 {formattedDate}</Text>
          <Text style={styles.detailDot}>·</Text>
          <Text style={styles.detail}>⏰ {booking.timeSlot}</Text>
        </View>
        <Text style={styles.rate}>💰 ${rate}/hr</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Badge
            label={booking.status}
            variant={statusVariantMap[booking.status]}
          />
          <Pressable onPress={toggleExpand} style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Details</Text>
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={Colors.accent.primary}
            />
          </Pressable>
        </View>

        {/* Accordion */}
        <Animated.View style={expandStyle}>
          <View style={styles.accordion}>
            <View style={styles.divider} />
            {booking.notes ? (
              <Text style={styles.accordionText}>📝 <Text style={styles.accordionValue}>{booking.notes}</Text></Text>
            ) : null}
            <Text style={styles.accordionText}>🎫 Ref: <Text style={styles.accordionValue}>#{booking._id.toUpperCase()}</Text></Text>
            <Text style={styles.accordionText}>💳 Rate: <Text style={styles.accordionValue}>${rate} for 60 min</Text></Text>
            
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <Pressable 
                style={[styles.cancelBtn, isCancelling && { opacity: 0.5 }]} 
                onPress={handleCancel}
                disabled={isCancelling}
              >
                <Text style={styles.cancelBtnText}>
                  {isCancelling ? 'Cancelling...' : 'Cancel Session'}
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  accentBorder: {
    width: 3,
    backgroundColor: 'rgba(255,69,0,0.4)',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
  info: {
    flex: 1,
  },
  expertName: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  expertTitle: {
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detail: {
    color: Colors.text.secondary,
    fontSize: 13,
  },
  detailDot: {
    color: Colors.text.muted,
    fontSize: 13,
  },
  rate: {
    color: Colors.text.secondary,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    color: Colors.accent.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  accordion: {
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.default,
    marginBottom: 2,
  },
  accordionText: {
    color: Colors.text.muted,
    fontSize: 13,
  },
  accordionValue: {
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  cancelBtn: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,69,0,0.1)',
    paddingVertical: 8,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  cancelBtnText: {
    color: Colors.status.error,
    fontSize: 13,
    fontWeight: '600',
  },
})
