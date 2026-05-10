// app/(tabs)/index.tsx  — Expert Listing Screen
import React from 'react'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ExpertCard from '../../components/expert/ExpertCard'
import ExpertCardSkeleton from '../../components/expert/ExpertCardSkeleton'
import SearchBar from '../../components/common/SearchBar'
import FilterChips from '../../components/common/FilterChips'
import EmptyState from '../../components/common/EmptyState'
import GradientText from '../../components/ui/GradientText'
import { useExperts } from '../../hooks/useExperts'
import { CATEGORIES } from '../../constants/mockData'
import { Colors, Spacing } from '../../constants/theme'

export default function ExpertListing() {
  const insets = useSafeAreaInsets()
  const {
    experts,
    loading,
    refreshing,
    loadingMore,
    hasNextPage,
    search,
    activeCategory,
    handleSearch,
    handleCategoryChange,
    refresh,
    fetchNextPage,
  } = useExperts()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const headerElement = (
    <View style={styles.listHeader}>
      {/* Hero Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Text style={styles.greeting}>{getGreeting()}, 👋</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Find Your </Text>
          <GradientText style={styles.title}>Expert</GradientText>
        </View>
        <Text style={styles.subtitle}>Book 1:1 sessions with top professionals</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={handleSearch} />
      </View>

      {/* Category Filters */}
      <FilterChips
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={handleCategoryChange}
      />

      {/* Results count */}
      {!loading && (
        <Text style={styles.resultsCount}>
          {experts.length} expert{experts.length !== 1 ? 's' : ''} found
        </Text>
      )}
    </View>
  )

  if (loading && experts.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {headerElement}
        <View style={styles.skeletonList}>
          {[0, 1, 2, 3].map((i) => (
            <ExpertCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={experts}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ExpertCard expert={item} index={index} />
        )}
        ListHeaderComponent={headerElement}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="No experts found"
            subtitle="Try a different search or category"
            actionLabel="Clear Search"
            onAction={() => {
              handleSearch('')
              handleCategoryChange('All')
            }}
          />
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            {loadingMore ? (
              <ActivityIndicator size="small" color={Colors.accent.primary} />
            ) : hasNextPage ? (
              <TouchableOpacity style={styles.nextButton} onPress={fetchNextPage}>
                <Text style={styles.nextButtonText}>Load More</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.accent.primary}
            colors={[Colors.accent.primary]}
          />
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
  listHeader: {
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    gap: 6,
  },
  greeting: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
  },
  resultsCount: {
    color: Colors.text.secondary,
    fontSize: 13,
    paddingHorizontal: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  skeletonList: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  footerContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.accent.primary,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
