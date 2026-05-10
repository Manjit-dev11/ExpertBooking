// components/expert/ExpertCard.tsx
import React, { useEffect } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import GlassCard from '../ui/GlassCard'
import GradientButton from '../ui/GradientButton'
import CategoryBadge from './CategoryBadge'
import RatingStars from './RatingStars'
import { Expert } from '../../constants/mockData'
import { Colors, Radius, Spacing } from '../../constants/theme'

interface ExpertCardProps {
  expert: Expert
  index: number
}

export default function ExpertCard({ expert, index }: ExpertCardProps) {
  const router = useRouter()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    const delay = index * 80
    opacity.value = withDelay(delay, withSpring(1, { damping: 18, stiffness: 200 }))
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 200 }))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[animatedStyle, styles.wrapper]}>
      <GlassCard
        style={styles.card}
        onPress={() => router.push(`/expert/${expert._id}`)}
      >
        {/* Orange left accent border */}
        <View style={styles.accentBorder} />

        <View style={styles.content}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: expert.avatar }}
                style={[
                  styles.avatar,
                  expert.isVerified && styles.verifiedAvatar,
                ]}
              />
              {expert.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Feather name="check" size={8} color="#FFF" />
                </View>
              )}
            </View>

            <View style={styles.nameSection}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>{expert.name}</Text>
                <CategoryBadge category={expert.category} />
              </View>
              <Text style={styles.title} numberOfLines={1}>{expert.title}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <RatingStars rating={expert.rating} size="sm" />
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>💼 {expert.experience}y</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>💰 ${expert.hourlyRate}</Text>
              <Text style={styles.statLabel}>Per Hour</Text>
            </View>
          </View>

          {/* Skills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.skillsScroll}
            contentContainerStyle={styles.skillsContainer}
          >
            {expert.skills.slice(0, 4).map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Bottom action */}
          <View style={styles.footer}>
            <Text style={styles.sessions}>🎯 {expert.totalSessions} sessions</Text>
            <GradientButton
              label="Book Session"
              onPress={() => router.push(`/expert/${expert._id}`)}
              size="sm"
            />
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBorder: {
    width: 3,
    backgroundColor: 'rgba(255,69,0,0.5)',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedAvatar: {
    borderWidth: 2,
    borderColor: Colors.accent.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg.primary,
  },
  nameSection: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    color: Colors.text.primary,
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  title: {
    color: Colors.text.secondary,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  statLabel: {
    color: Colors.text.muted,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border.default,
  },
  skillsScroll: {
    marginHorizontal: -Spacing.xs,
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  skillPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  skillText: {
    color: Colors.text.secondary,
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessions: {
    color: Colors.text.muted,
    fontSize: 12,
  },
})
