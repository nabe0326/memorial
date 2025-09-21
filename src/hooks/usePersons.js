import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

// 人物一覧を取得
export function usePersons() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['persons'],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('persons')
        .select(`
          *,
          events(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Persons fetch error:', error)
        throw error
      }

      return data || []
    },
    enabled: !!user, // ユーザーがログインしている時のみ実行
  })
}

// 特定の人物を取得
export function usePerson(id) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['persons', id],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')
      if (!id) throw new Error('IDが必要です')

      const { data, error } = await supabase
        .from('persons')
        .select(`
          *,
          events(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Person fetch error:', error)
        throw error
      }

      return data
    },
    enabled: !!user && !!id,
  })
}

// 人物を作成
export function useCreatePerson() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (personData) => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('persons')
        .insert({
          ...personData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Person create error:', error)
        throw error
      }

      return data
    },
    onSuccess: (newPerson) => {
      // キャッシュを更新
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      
      // オプティミスティック更新
      queryClient.setQueryData(['persons'], (oldData) => {
        return oldData ? [newPerson, ...oldData] : [newPerson]
      })
      
      toast.success(`${newPerson.name}を追加しました`)
    },
    onError: (error) => {
      console.error('Create person error:', error)
      toast.error('人物の追加に失敗しました')
    }
  })
}

// 人物を更新
export function useUpdatePerson() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (!user) throw new Error('認証が必要です')

      const { data, error } = await supabase
        .from('persons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Person update error:', error)
        throw error
      }

      return data
    },
    onSuccess: (updatedPerson) => {
      // 人物一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      
      // 特定の人物のキャッシュを更新
      queryClient.setQueryData(['persons', updatedPerson.id], updatedPerson)
      
      // 人物一覧のオプティミスティック更新
      queryClient.setQueryData(['persons'], (oldData) => {
        return oldData?.map(person => 
          person.id === updatedPerson.id ? updatedPerson : person
        )
      })
      
      toast.success(`${updatedPerson.name}の情報を更新しました`)
    },
    onError: (error) => {
      console.error('Update person error:', error)
      toast.error('人物の更新に失敗しました')
    }
  })
}

// 人物を削除
export function useDeletePerson() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id) => {
      if (!user) throw new Error('認証が必要です')

      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Person delete error:', error)
        throw error
      }

      return id
    },
    onSuccess: (deletedId) => {
      // キャッシュから削除
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      queryClient.removeQueries({ queryKey: ['persons', deletedId] })
      
      // オプティミスティック更新
      queryClient.setQueryData(['persons'], (oldData) => {
        return oldData?.filter(person => person.id !== deletedId)
      })
      
      toast.success('人物を削除しました')
    },
    onError: (error) => {
      console.error('Delete person error:', error)
      toast.error('人物の削除に失敗しました')
    }
  })
}

// 人物の検索
export function useSearchPersons(searchTerm) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['persons', 'search', searchTerm],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')
      if (!searchTerm || searchTerm.length < 2) return []

      const { data, error } = await supabase
        .from('persons')
        .select(`
          *,
          events(*)
        `)
        .ilike('name', `%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Persons search error:', error)
        throw error
      }

      return data || []
    },
    enabled: !!user && !!searchTerm && searchTerm.length >= 2,
  })
}

// 関係性でフィルタリング
export function usePersonsByRelationship(relationship) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['persons', 'relationship', relationship],
    queryFn: async () => {
      if (!user) throw new Error('認証が必要です')

      let query = supabase
        .from('persons')
        .select(`
          *,
          events(*)
        `)

      if (relationship && relationship !== 'all') {
        query = query.eq('relationship', relationship)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Persons filter error:', error)
        throw error
      }

      return data || []
    },
    enabled: !!user,
  })
}