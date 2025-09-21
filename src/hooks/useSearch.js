import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useLocalStorage } from './useLocalStorage'

// デバウンス用のカスタムフック
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 検索フック
export function useSearch() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', [])
  
  const debouncedQuery = useDebounce(query, 300)

  // イベント検索
  const { data: eventResults = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ['search', 'events', debouncedQuery],
    queryFn: async () => {
      if (!user || !debouncedQuery.trim()) return []

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .or(`title.ilike.%${debouncedQuery}%,memo.ilike.%${debouncedQuery}%`)
        .order('date', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Event search error:', error)
        throw error
      }

      return (data || []).map(event => ({
        ...event,
        type: 'event',
        person_name: event.persons?.name,
        description: event.memo || '',
        notification_enabled: event.notification_settings?.email || false,
        notification_days_before: event.notification_settings?.days_before?.[0] || 1
      }))
    },
    enabled: !!user && !!debouncedQuery.trim(),
  })

  // 人物検索
  const { data: personResults = [], isLoading: isPersonsLoading } = useQuery({
    queryKey: ['search', 'persons', debouncedQuery],
    queryFn: async () => {
      if (!user || !debouncedQuery.trim()) return []

      const { data, error } = await supabase
        .from('persons')
        .select(`
          *,
          events(count)
        `)
        .or(`name.ilike.%${debouncedQuery}%,memo.ilike.%${debouncedQuery}%,relationship.ilike.%${debouncedQuery}%`)
        .order('name', { ascending: true })
        .limit(20)

      if (error) {
        console.error('Person search error:', error)
        throw error
      }

      return (data || []).map(person => ({
        ...person,
        type: 'person',
        events_count: person.events?.length || 0
      }))
    },
    enabled: !!user && !!debouncedQuery.trim(),
  })

  // 結果をマージ
  const results = useMemo(() => {
    return [...eventResults, ...personResults]
  }, [eventResults, personResults])

  const isLoading = isEventsLoading || isPersonsLoading

  // 検索履歴に追加
  const addToSearchHistory = (searchQuery) => {
    if (!searchQuery.trim()) return

    const newHistory = [
      searchQuery,
      ...searchHistory.filter(item => item !== searchQuery)
    ].slice(0, 10) // 最大10件まで保存

    setSearchHistory(newHistory)
  }

  // 検索実行
  const search = (searchQuery) => {
    setQuery(searchQuery)
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim())
    }
  }

  // 検索クリア
  const clearSearch = () => {
    setQuery('')
  }

  // 検索履歴クリア
  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  return {
    query,
    setQuery: search,
    clearQuery: clearSearch,
    results,
    isLoading,
    searchHistory,
    clearSearchHistory,
    addToSearchHistory
  }
}

// フィルター機能付き検索フック
export function useFilteredSearch() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    categories: [], // ['誕生日', '記念日']
    relationships: [], // フィルター対象の関係性
    dateRange: null, // { start: Date, end: Date }
    personIds: [] // 特定の人物でフィルター
  })
  

  const debouncedQuery = useDebounce(query, 300)

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['filtered-search', debouncedQuery, JSON.stringify(filters)],
    queryFn: async () => {
      if (!user) return []
      

      // フィルターが何も設定されていない場合は全件検索
      const hasTextQuery = debouncedQuery.trim().length > 0
      const hasFilters = filters.categories.length > 0 || 
                        filters.relationships.length > 0 || 
                        filters.personIds.length > 0 || 
                        filters.dateRange
      

      // テキスト検索も含めて何も条件がない場合は最近のデータを返す
      if (!hasTextQuery && !hasFilters) {
        // 何も条件がない場合は最近のイベントと人物を表示
        const [recentEventsResult, recentPersonsResult] = await Promise.all([
          supabase
            .from('events')
            .select(`*, persons(id, name, relationship)`)
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('persons')
            .select(`*, events(count)`)
            .order('created_at', { ascending: false })
            .limit(10)
        ])

        const recentEvents = (recentEventsResult.data || []).map(event => ({
          ...event,
          type: 'event',
          person_name: event.persons?.name,
          description: event.memo || '',
        }))

        const recentPersons = (recentPersonsResult.data || []).map(person => ({
          ...person,
          type: 'person',
          events_count: person.events?.length || 0
        }))

        return [...recentEvents, ...recentPersons]
      }

      // イベント検索のベースクエリ
      let eventsQuery = supabase
        .from('events')
        .select(`
          *,
          persons(id, name, relationship)
        `)

      // 人物検索のベースクエリ  
      let personsQuery = supabase
        .from('persons')
        .select(`
          *,
          events(count)
        `)

      // テキスト検索の条件を構築
      const textConditions = []
      if (hasTextQuery) {
        textConditions.push(`title.ilike.%${debouncedQuery}%`)
        textConditions.push(`memo.ilike.%${debouncedQuery}%`)
      }

      // カテゴリフィルター - 正確な一致のみ
      if (filters.categories.length > 0) {
        eventsQuery = eventsQuery.in('category', filters.categories)
      }

      // 関係性フィルター（人物とイベントの両方に適用）
      if (filters.relationships.length > 0) {
        personsQuery = personsQuery.in('relationship', filters.relationships)
        
        // イベントも関係性でフィルター
        const personIds = await supabase
          .from('persons')
          .select('id')
          .in('relationship', filters.relationships)
          .then(({ data }) => data?.map(p => p.id) || [])
        
        if (personIds.length > 0) {
          eventsQuery = eventsQuery.in('person_id', personIds)
        } else {
          // 該当する人物がいない場合はイベントも0件
          eventsQuery = eventsQuery.eq('person_id', 'non-existent-id')
        }
      }

      // 人物フィルター
      if (filters.personIds.length > 0) {
        eventsQuery = eventsQuery.in('person_id', filters.personIds)
        personsQuery = personsQuery.in('id', filters.personIds)
      }

      // 日付範囲フィルター
      if (filters.dateRange?.start || filters.dateRange?.end) {
        if (filters.dateRange.start) {
          eventsQuery = eventsQuery.gte('date', filters.dateRange.start.toISOString().split('T')[0])
        }
        if (filters.dateRange.end) {
          eventsQuery = eventsQuery.lte('date', filters.dateRange.end.toISOString().split('T')[0])
        }
      }

      // テキスト検索の条件を適用（フィルターと組み合わせ）
      if (hasTextQuery) {
        if (textConditions.length > 0) {
          eventsQuery = eventsQuery.or(textConditions.join(','))
        }
        personsQuery = personsQuery.or(`name.ilike.%${debouncedQuery}%,memo.ilike.%${debouncedQuery}%,relationship.ilike.%${debouncedQuery}%`)
      }

      // クエリ実行
      
      const [eventsResult, personsResult] = await Promise.all([
        eventsQuery.order('date', { ascending: false }).limit(50),
        personsQuery.order('name', { ascending: true }).limit(50)
      ])
      
      

      if (eventsResult.error) {
        console.error('Filtered events search error:', eventsResult.error)
        throw eventsResult.error
      }

      if (personsResult.error) {
        console.error('Filtered persons search error:', personsResult.error)
        throw personsResult.error
      }

      const events = (eventsResult.data || []).map(event => ({
        ...event,
        type: 'event',
        person_name: event.persons?.name,
        description: event.memo || '',
        notification_enabled: event.notification_settings?.email || false,
        notification_days_before: event.notification_settings?.days_before?.[0] || 1
      }))

      const persons = (personsResult.data || []).map(person => ({
        ...person,
        type: 'person',
        events_count: person.events?.length || 0
      }))

      // 人物の結果を含めるかどうかを判定
      // 人物フィルターが単独で適用されている場合のみ人物結果を含める
      const shouldIncludePersons = (
        filters.personIds.length > 0 && // 人物フィルターが設定されている
        filters.categories.length === 0 && // かつ他のフィルターが設定されていない
        filters.relationships.length === 0 &&
        !filters.dateRange
      ) || (
        // またはテキスト検索のみの場合
        hasTextQuery && 
        filters.categories.length === 0 && 
        filters.relationships.length === 0 && 
        filters.personIds.length === 0 && 
        !filters.dateRange
      ) || (
        // または何もフィルターが設定されていない場合（初期表示）
        !hasTextQuery && !hasFilters
      )

      return shouldIncludePersons ? [...events, ...persons] : events
    },
    enabled: !!user,
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      relationships: [],
      dateRange: null,
      personIds: []
    })
  }

  const hasActiveFilters = Object.values(filters).some(filter => {
    if (Array.isArray(filter)) return filter.length > 0
    return !!filter
  })

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    results,
    isLoading
  }
}