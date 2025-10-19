import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 初回認証状態の確認
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session error:', error)
          setError(error.message)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Auth error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // メールアドレス・パスワードでサインアップ
  const signUp = useCallback(async (email, password, options = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          ...options
        }
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'サインアップに失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // メールアドレス・パスワードでサインイン
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'サインインに失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Googleでサインイン
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Googleサインインに失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // パスワードリセット
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'パスワードリセットに失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // サインアウト
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'サインアウトに失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // アカウント削除
  const deleteAccount = useCallback(async (deletionMode = 'delayed') => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: session } = await supabase.auth.getSession()
      
      if (!session?.session?.access_token) {
        throw new Error('認証トークンが見つかりません')
      }

      // 即座削除モード
      if (deletionMode === 'immediate') {
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-processor`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.session.access_token}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Immediate deletion successful:', result)
            return { success: true, immediate: true }
          } else {
            console.warn('Immediate deletion failed, trying delayed deletion')
          }
        } catch (functionError) {
          console.warn('Immediate deletion not available, trying delayed deletion:', functionError.message)
        }
      }

      // 遅延削除モード（デフォルト）
      try {
        const { data: result, error } = await supabase.rpc('schedule_user_deletion', { days_delay: 7 })
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (result?.success) {
          // ユーザーをサインアウト
          await supabase.auth.signOut()
          
          return { 
            success: true, 
            delayed: true,
            deletionDate: result.deletion_scheduled_at,
            message: result.message
          }
        } else {
          throw new Error(result?.error || 'スケジュール削除に失敗しました')
        }
      } catch (rpcError) {
        console.warn('Scheduled deletion not available, falling back to immediate data deletion:', rpcError.message)
      }

      // フォールバック: SQL関数を使用してデータ削除
      console.log('Executing fallback: calling delete_user_data RPC function')
      
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('delete_user_data')
        
        if (rpcError) {
          console.error('RPC delete_user_data error:', rpcError)
          throw new Error(rpcError.message)
        }
        
        if (rpcResult?.success) {
          // ユーザーをサインアウト
          const { error: signOutError } = await supabase.auth.signOut()
          
          if (signOutError) {
            setError(signOutError.message)
            return { success: false, error: signOutError.message }
          }
          
          return { 
            success: true, 
            fallback: true,
            message: 'ユーザーデータを削除しました。認証アカウントは後日自動削除されます。'
          }
        } else {
          throw new Error(rpcResult?.error || 'データ削除に失敗しました')
        }
      } catch (rpcError) {
        console.error('RPC function not available, using direct deletion:', rpcError.message)
        
        // 最終フォールバック: 直接削除
        const { error: personsError } = await supabase
          .from('persons')
          .delete()
          .eq('user_id', user.id)
        
        if (personsError) {
          console.error('Persons deletion error:', personsError)
        }

        const { error: eventsError } = await supabase
          .from('events')
          .delete()
          .eq('user_id', user.id)
        
        if (eventsError) {
          console.error('Events deletion error:', eventsError)
        }

        // ユーザーをサインアウト
        const { error: signOutError } = await supabase.auth.signOut()
        
        if (signOutError) {
          setError(signOutError.message)
          return { success: false, error: signOutError.message }
        }

        return { 
          success: true, 
          fallback: true,
          message: 'ユーザーデータを削除しました。認証アカウントは手動で削除する必要があります。'
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'アカウント削除に失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])

  // 削除キャンセル（再ログイン時）
  const cancelAccountDeletion = useCallback(async () => {
    try {
      const { data: result, error } = await supabase.rpc('cancel_user_deletion')
      
      if (error) {
        console.error('Cancel deletion error:', error)
        return { success: false, error: error.message }
      }
      
      return { success: true, ...result }
    } catch (err) {
      console.error('Cancel deletion error:', err)
      return { success: false, error: err.message }
    }
  }, [])

  const isAuthenticated = useMemo(() => !!user, [user])

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut,
    deleteAccount,
    cancelAccountDeletion,
    isAuthenticated
  }
}