import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { startOfMonth, endOfMonth, format } from 'date-fns'

// 指定された月のイベントを取得
export function useCalendarEvents(date = new Date()) {
  const { user } = useAuth()
  
  const startDate = startOfMonth(date)
  const endDate = endOfMonth(date)

  return useQuery({
    queryKey: ['calendar-events', format(startDate, 'yyyy-MM'), format(endDate, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true })

      if (error) {
        console.error('Calendar events fetch error:', error)
        throw error
      }

      return (data || []).map(event => ({
        ...event,
        person_name: event.persons?.name,
        description: event.memo || '',
        notification_enabled: event.notification_settings?.email || false,
        notification_days_before: event.notification_settings?.days_before?.[0] || 1
      }))
    },
    enabled: !!user,
  })
}

// 指定された日付範囲のイベントを取得
export function useCalendarEventsByRange(startDate, endDate) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['calendar-events-range', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true })

      if (error) {
        console.error('Calendar events range fetch error:', error)
        throw error
      }

      return (data || []).map(event => ({
        ...event,
        person_name: event.persons?.name,
        description: event.memo || '',
        notification_enabled: event.notification_settings?.email || false,
        notification_days_before: event.notification_settings?.days_before?.[0] || 1
      }))
    },
    enabled: !!user && !!startDate && !!endDate,
  })
}

// 今日のイベントを取得
export function useTodayEvents() {
  const { user } = useAuth()
  const today = format(new Date(), 'yyyy-MM-dd')

  return useQuery({
    queryKey: ['today-events', today],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .eq('date', today)
        .order('title', { ascending: true })

      if (error) {
        console.error('Today events fetch error:', error)
        throw error
      }

      return (data || []).map(event => ({
        ...event,
        person_name: event.persons?.name,
        description: event.memo || '',
        notification_enabled: event.notification_settings?.email || false,
        notification_days_before: event.notification_settings?.days_before?.[0] || 1
      }))
    },
    enabled: !!user,
  })
}