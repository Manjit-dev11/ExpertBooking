// components/expert/ExpertCardSkeleton.tsx
import React from 'react'
import { StyleSheet, View } from 'react-native'
import GlassCard from '../ui/GlassCard'
import SkeletonBox from '../ui/SkeletonBox'
import { Colors, Radius, Spacing } from '../../constants/theme'

export default function ExpertCardSkeleton() {
  return (
    <GlassCard style={styles.card} disableAnimation>
      <View style={styles.accentBorder} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <SkeletonBox width={60} height={60} borderRadius={30} />
          <View style={styles.nameSection}>
            <SkeletonBox width={140} height={17} borderRadius={8} />
            <SkeletonBox width={100} height={13} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <SkeletonBox width="30%" height={32} borderRadius={Radius.sm} />
          <SkeletonBox width="30%" height={32} borderRadius={Radius.sm} />
          <SkeletonBox width="30%" height={32} borderRadius={Radius.sm} />
        </View>
        <View style={styles.skillsRow}>
          <SkeletonBox width={60} height={24} borderRadius={Radius.full} />
          <SkeletonBox width={80} height={24} borderRadius={Radius.full} />
          <SkeletonBox width={50} height={24} borderRadius={Radius.full} />
        </View>
        <View style={styles.footer}>
          <SkeletonBox width={90} height={13} borderRadius={6} />
          <SkeletonBox width={110} height={38} borderRadius={Radius.full} />
        </View>
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
    backgroundColor: 'rgba(255,69,0,0.2)',
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
  nameSection: {
    flex: 1,
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
