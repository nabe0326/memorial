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
  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: session } = await supabase.auth.getSession()
      
      if (!session?.session?.access_token) {
        throw new Error('認証トークンが見つかりません')
      }

      // Edge Function による即座削除を試行
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
          return { success: true }
        } else {
          console.warn('Edge Function deletion failed, trying direct deletion')
        }
      } catch (functionError) {
        console.warn('Edge Function not available, trying direct deletion:', functionError.message)
      }

      // フォールバック: 直接削除
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

      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'アカウント削除に失敗しました'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])


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
    isAuthenticated
  }
}