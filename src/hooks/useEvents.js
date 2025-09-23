import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { 
  transformEventFromDB, 
  transformEventToDB, 
  transformEventUpdatesToDB, 
  getEventErrorMessage 
} from '../lib/dataTransforms'

// イベント一覧を取得
export function useEvents() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(*)
        `)
        .order('date', { ascending: true })

      if (error) {
        console.error('Events fetch error:', error)
        throw error
      }

      // Transform database data to application format
      return (data || []).map(transformEventFromDB)
    },
    enabled: !!user,
  })
}

// 今後のイベント一覧を取得
export function useUpcomingEvents(limit = 50) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')
      
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('Upcoming events fetch error:', error)
        throw error
      }

      return (data || []).map(transformEventFromDB)
    },
    enabled: !!user,
  })
}

// 特定の人物のイベントを取得
export function useEventsByPersonId(personId) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['events', 'person', personId],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')
      if (!personId) throw new Error('人物IDが必要です')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          persons(id, name)
        `)
        .eq('person_id', personId)
        .order('date', { ascending: true })

      if (error) {
        console.error('Person events fetch error:', error)
        throw error
      }

      return (data || []).map(transformEventFromDB)
    },
    enabled: !!user && !!personId,
  })
}

// 特定の人物のイベントを取得（既存関数の別名）
export function usePersonEvents(personId) {
  return useEventsByPersonId(personId)
}

// イベントを作成
export function useCreateEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const invalidateQueries = useCallback((personId) => {
    queryClient.invalidateQueries({ queryKey: ['events'] })
    queryClient.invalidateQueries({ queryKey: ['events', 'person', personId] })
    queryClient.invalidateQueries({ queryKey: ['persons'] })
  }, [queryClient])

  return useMutation({
    mutationFn: async (eventData) => {
      if (!user) throw new Error('認証が必要です')

      if (!eventData.person_id) {
        throw new Error('person_idが必要です')
      }

      const dbData = transformEventToDB(eventData)

      console.log('Creating event with data:', dbData)
      console.log('Category being sent:', eventData.category)

      const { data, error } = await supabase
        .from('events')
        .insert(dbData)
        .select()
        .single()

      if (error) {
        console.error('Event create error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      return transformEventFromDB(data)
    },
    onSuccess: (newEvent) => {
      invalidateQueries(newEvent.person_id)
      toast.success(`イベント「${newEvent.title}」を追加しました`)
    },
    onError: (error) => {
      console.error('Create event error:', error)
      const errorMessage = getEventErrorMessage(error) || 'イベントの追加に失敗しました'
      toast.error(errorMessage)
    }
  })
}

// イベントを更新
export function useUpdateEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const invalidateQueries = useCallback((personId) => {
    queryClient.invalidateQueries({ queryKey: ['events'] })
    queryClient.invalidateQueries({ queryKey: ['events', 'person', personId] })
    queryClient.invalidateQueries({ queryKey: ['persons'] })
  }, [queryClient])

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (!user) throw new Error('認証が必要です')

      if (!id) {
        throw new Error('イベントIDが必要です')
      }

      const dbUpdates = transformEventUpdatesToDB(updates)

      console.log('Updating event with data:', { id, updates: dbUpdates })

      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Event update error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      return transformEventFromDB(data)
    },
    onSuccess: (updatedEvent) => {
      invalidateQueries(updatedEvent.person_id)
      toast.success(`イベント「${updatedEvent.title}」を更新しました`)
    },
    onError: (error) => {
      console.error('Update event error:', error)
      const errorMessage = getEventErrorMessage(error) || 'イベントの更新に失敗しました'
      toast.error(errorMessage)
    }
  })
}

// イベントを削除
export function useDeleteEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['events'] })
    queryClient.invalidateQueries({ queryKey: ['persons'] })
  }, [queryClient])

  return useMutation({
    mutationFn: async (id) => {
      if (!user) throw new Error('認証が必要です')

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Event delete error:', error)
        throw error
      }

      return id
    },
    onSuccess: () => {
      invalidateQueries()
      toast.success('イベントを削除しました')
    },
    onError: (error) => {
      console.error('Delete event error:', error)
      toast.error('イベントの削除に失敗しました')
    }
  })
}