import { useState, useEffect, useCallback, useRef } from 'react'
import { Expert } from '../constants/mockData'
import { api } from '../services/api'

export function useExperts() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchExperts = useCallback(
    async (query: string, category: string, isRefresh = false, pageNum = 1) => {
      try {
        if (pageNum === 1) {
          if (!isRefresh) setLoading(true)
          else setRefreshing(true)
        } else {
          setLoadingMore(true)
        }

        const params: any = { limit: 10, page: pageNum }
        if (category !== 'All') params.category = category
        if (query.trim()) params.search = query.trim()

        const response = await api.get('/experts', { params })
        if (response.data.success) {
          const newExperts = response.data.data.experts
          const pagination = response.data.data.pagination

          if (pageNum === 1) {
            setExperts(newExperts)
          } else {
            setExperts((prev) => [...prev, ...newExperts])
          }
          setPage(pageNum)
          setHasNextPage(pagination.hasNextPage)
        }
      } catch (error) {
        console.error('Error fetching experts:', error)
      } finally {
        setLoading(false)
        setRefreshing(false)
        setLoadingMore(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchExperts(search, activeCategory, false, 1)
  }, [])

  const handleSearch = (query: string) => {
    setSearch(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchExperts(query, activeCategory, false, 1)
    }, 500)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    fetchExperts(search, category, false, 1)
  }

  const refresh = () => {
    fetchExperts(search, activeCategory, true, 1)
  }

  const fetchNextPage = () => {
    if (hasNextPage && !loadingMore) {
      fetchExperts(search, activeCategory, false, page + 1)
    }
  }

  return {
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
  }
}
