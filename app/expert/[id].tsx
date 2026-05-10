// app/expert/[id].tsx — Expert Detail Screen
import React, { useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { format, isToday, isTomorrow } from 'date-fns'
import GlassCard from '../../components/ui/GlassCard'
import GradientButton from '../../components/ui/GradientButton'
import CategoryBadge from '../../components/expert/CategoryBadge'
import RatingStars from '../../components/expert/RatingStars'
import LiveIndicator from '../../components/ui/LiveIndicator'
import TimeSlotGrid from '../../components/booking/TimeSlotGrid'
import { Expert } from '../../constants/mockData'
import { Colors, Gradients, Radius, Spacing } from '../../constants/theme'
import { api } from '../../services/api'
import { io, Socket } from 'socket.io-client'
import { ActivityIndicator } from 'react-native'

function formatDateTab(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE d')
}

export default function ExpertDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  
  const [expert, setExpert] = useState<Expert | null>(null)
  const [loading, setLoading] = useState(true)
  const [slots, setSlots] = useState<{ date: string; time: string; isBooked: boolean }[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bioExpanded, setBioExpanded] = useState(false)

  // Bottom bar animation
  const bottomBarY = useSharedValue(120)
  const bottomBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarY.value }],
  }))

  // Fetch expert data
  useEffect(() => {
    async function fetchExpert() {
      try {
        const response = await api.get(`/experts/${id}`)
        if (response.data.success) {
          const fetchedExpert = response.data.data.expert
          setExpert(fetchedExpert)
          setSlots(fetchedExpert.availableSlots || [])
          
          const dates = [...new Set((fetchedExpert.availableSlots || []).map((s: any) => s.date))]
          if (dates.length > 0) setSelectedDate(dates[0] as string)
        }
      } catch (error) {
        console.error('Error fetching expert:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExpert()
  }, [id])

  // Real-time Socket.io Connection
  useEffect(() => {
    if (!expert) return

    // Connect to the same baseURL as the API
    const socket: Socket = io(api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.7:5000')

    socket.on('connect', () => {
      console.log('Connected to WebSocket')
      socket.emit('join:expert', id)
    })

    socket.on('slot:booked', (data: { expertId: string; date: string; timeSlot: string }) => {
      if (data.expertId === id) {
        setSlots((prev) =>
          prev.map((s) =>
            s.date === data.date && s.time === data.timeSlot
              ? { ...s, isBooked: true }
              : s
          )
        )
        // Show toast
        Toast.show({
          type: 'error',
          text1: '🔴 Slot just taken!',
          text2: `${data.timeSlot} on ${formatDateTab(data.date)} was just booked by someone else!`,
          visibilityTime: 4000,
        })
        
        // Deselect if user had it selected
        if (selectedDate === data.date && selectedSlot === data.timeSlot) {
          setSelectedSlot(null)
          bottomBarY.value = withTiming(120, { duration: 200 })
        }
      }
    })

    socket.on('slot:freed', (data: { expertId: string; date: string; timeSlot: string }) => {
      if (data.expertId === id) {
        setSlots((prev) =>
          prev.map((s) =>
            s.date === data.date && s.time === data.timeSlot
              ? { ...s, isBooked: false }
              : s
          )
        )
      }
    })

    return () => {
      socket.emit('leave:expert', id)
      socket.disconnect()
    }
  }, [expert, id, selectedDate, selectedSlot])

  // Filter out past dates and times
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const validSlots = slots.filter((s) => {
    if (s.date < todayStr) return false
    if (s.date === todayStr) {
      const [time, period] = s.time.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      if (hours * 60 + minutes <= currentMinutes) return false
    }
    return true
  })

  // Unique dates from valid slots
  const uniqueDates = [...new Set(validSlots.map((s) => s.date))]

  const handleSlotSelect = useCallback(
    (time: string) => {
      setSelectedSlot((prev) => (prev === time ? null : time))
      const newVal = selectedSlot === time ? null : time
      bottomBarY.value = withSpring(newVal ? 0 : 120, { damping: 16, stiffness: 240 })
    },
    [selectedSlot]
  )

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    bottomBarY.value = withTiming(120, { duration: 200 })
  }

  const slotsForDate = validSlots.filter((s) => s.date === selectedDate)

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
      </View>
    )
  }

  if (!expert) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.text.primary }}>Expert not found.</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 140 + insets.bottom }]}
      >
        {/* Back button */}
        <View style={[styles.backRow, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={22} color={Colors.accent.primary} />
          </Pressable>
          <Text style={styles.backLabel}>Expert Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Card */}
        <GlassCard style={styles.heroCard} disableAnimation>
          <LinearGradient
            colors={['rgba(255,69,0,0.08)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <Image source={{ uri: expert.avatar }} style={styles.heroAvatar} />
          {expert.isVerified && (
            <View style={styles.verifiedPill}>
              <Feather name="check-circle" size={12} color={Colors.accent.primary} />
              <Text style={styles.verifiedText}>Verified Expert</Text>
            </View>
          )}
          <Text style={styles.heroName}>{expert.name}</Text>
          <Text style={styles.heroTitle}>{expert.title}</Text>
          <CategoryBadge category={expert.category} showEmoji style={styles.heroBadge} />
        </GlassCard>

        {/* Stats row */}
        <GlassCard style={styles.statsCard} disableAnimation>
          <View style={styles.statItem}>
            <RatingStars rating={expert.rating} size="md" />
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🎯 {expert.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${expert.hourlyRate}/hr</Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </GlassCard>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SKILLS</Text>
          <FlatList
            data={expert.skills}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.skillsList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.sm }} />}
            renderItem={({ item }) => (
              <GlassCard style={styles.skillChip} disableAnimation>
                <Text style={styles.skillText}>{item}</Text>
              </GlassCard>
            )}
          />
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <GlassCard style={styles.bioCard} disableAnimation>
            <Text
              style={styles.bioText}
              numberOfLines={bioExpanded ? undefined : 3}
            >
              {expert.bio}
            </Text>
            <Pressable onPress={() => setBioExpanded(!bioExpanded)} style={styles.readMore}>
              <Text style={styles.readMoreText}>
                {bioExpanded ? 'Show less' : 'Read more'}
              </Text>
              <Feather
                name={bioExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={Colors.accent.primary}
              />
            </Pressable>
          </GlassCard>
        </View>

        {/* Available Slots */}
        <View style={styles.section}>
          <View style={styles.slotHeader}>
            <Text style={styles.sectionTitle}>Available Slots</Text>
            <LiveIndicator />
          </View>

          {/* Date Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateTabs}
          >
            {uniqueDates.map((date) => {
              const isActive = date === selectedDate
              return (
                <Pressable
                  key={date}
                  onPress={() => handleDateChange(date)}
                  style={styles.dateTabWrapper}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={Gradients.accent}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.dateTab}
                    >
                      <Text style={[styles.dateTabText, styles.activeTabText]}>
                        {formatDateTab(date)}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.dateTab, styles.inactiveDateTab]}>
                      <Text style={styles.dateTabText}>{formatDateTab(date)}</Text>
                    </View>
                  )}
                </Pressable>
              )
            })}
          </ScrollView>

          {/* Slot Grid */}
          <View style={styles.slotGrid}>
            <TimeSlotGrid
              slots={slotsForDate}
              selectedSlot={selectedSlot}
              onSelect={handleSlotSelect}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <Animated.View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + Spacing.lg },
          bottomBarStyle,
        ]}
      >
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.selectedLabel}>Selected</Text>
            <Text style={styles.selectedSlotText}>
              {selectedDate ? formatDateTab(selectedDate) : ''} · {selectedSlot}
            </Text>
          </View>
          <GradientButton
            label="Book Now →"
            onPress={() =>
              router.push({
                pathname: '/booking/[expertId]',
                params: {
                  expertId: expert._id,
                  date: selectedDate,
                  slot: selectedSlot ?? '',
                },
              })
            }
            size="md"
          />
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  heroCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  heroAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.accent.primary,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,69,0,0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  verifiedText: {
    color: Colors.accent.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  heroName: {
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroTitle: {
    color: Colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  heroBadge: {
    alignSelf: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.text.muted,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border.default,
  },
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    color: Colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  skillsList: {
    paddingVertical: 2,
  },
  skillChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  skillText: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  bioCard: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  bioText: {
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: Colors.accent.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTabs: {
    gap: Spacing.sm,
  },
  dateTabWrapper: {},
  dateTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  inactiveDateTab: {
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  dateTabText: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.text.primary,
  },
  slotGrid: {
    marginTop: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLabel: {
    color: Colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  selectedSlotText: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
})
