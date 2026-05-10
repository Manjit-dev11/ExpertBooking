// app/(tabs)/bookings.tsx — My Bookings Screen
import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import GlassCard from '../../components/ui/GlassCard'
import GradientButton from '../../components/ui/GradientButton'
import BookingStatusCard from '../../components/booking/BookingStatusCard'
import EmptyState from '../../components/common/EmptyState'
import SkeletonBox from '../../components/ui/SkeletonBox'
import { useBookings } from '../../hooks/useBookings'
import { Colors, Radius, Spacing } from '../../constants/theme'

const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Completed']

function BookingSkeleton() {
  return (
    <GlassCard style={styles.skeletonCard} disableAnimation>
      <View style={{ width: 3, backgroundColor: 'rgba(255,69,0,0.2)' }} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonRow}>
          <SkeletonBox width={44} height={44} borderRadius={22} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox width="60%" height={16} />
            <SkeletonBox width="40%" height={12} />
          </View>
        </View>
        <SkeletonBox width="80%" height={13} />
        <View style={styles.skeletonRow}>
          <SkeletonBox width={80} height={24} borderRadius={Radius.full} />
          <SkeletonBox width={60} height={20} borderRadius={8} />
        </View>
      </View>
    </GlassCard>
  )
}

export default function BookingsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { bookings, loading, activeStatus, setActiveStatus, fetchByEmail } = useBookings()
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)

  const handleFind = () => {
    if (!email.trim()) return
    setSearched(true)
    fetchByEmail(email.trim())
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={loading ? [] : bookings}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Page header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pageTitle}>My Bookings</Text>
                <Text style={styles.pageSubtitle}>Track all your sessions</Text>
              </View>
              {email.trim() ? (
                <Pressable
                  onPress={handleFind}
                  style={({ pressed }) => [
                    styles.refreshBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Feather name="refresh-cw" size={20} color={Colors.text.primary} />
                </Pressable>
              ) : null}
            </View>

            {/* Email lookup */}
            <GlassCard style={styles.lookupCard} disableAnimation>
              <Text style={styles.lookupLabel}>Enter your email to find bookings</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="rahul@example.com"
                placeholderTextColor={Colors.text.muted}
                style={styles.emailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={handleFind}
                returnKeyType="search"
              />
              <GradientButton
                label="Find Bookings"
                onPress={handleFind}
                loading={loading}
                size="md"
              />
            </GlassCard>

            {/* Status tabs */}
            {searched && !loading && (
              <View style={styles.statusTabs}>
                {STATUS_TABS.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveStatus(tab)}
                    style={[
                      styles.statusTab,
                      activeStatus === tab && styles.activeStatusTab,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTabText,
                        activeStatus === tab && styles.activeStatusTabText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Skeletons */}
            {loading && (
              <View style={{ gap: Spacing.md, marginTop: Spacing.md }}>
                <BookingSkeleton />
                <BookingSkeleton />
                <BookingSkeleton />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => <BookingStatusCard booking={item} />}
        ListEmptyComponent={
          searched && !loading ? (
            <EmptyState
              icon="calendar"
              title="No bookings yet"
              subtitle="Book your first session with an expert"
              actionLabel="Explore Experts"
              onAction={() => router.push('/')}
            />
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    gap: 0,
  },
  headerSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 4,
  },
  refreshBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  pageTitle: {
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  lookupCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  lookupLabel: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  emailInput: {
    backgroundColor: Colors.bg.input,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  statusTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  statusTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  activeStatusTab: {
    backgroundColor: Colors.accent.primary,
  },
  statusTabText: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusTabText: {
    color: Colors.text.primary,
  },
  skeletonCard: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  skeletonContent: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
})
