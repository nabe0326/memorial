import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  // 認証状態
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // UI状態
  showAuthModal: false,
  authMode: 'login', // 'login' | 'signup' | 'reset'
  rememberMe: false,

  // アクション
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // 認証モーダル制御
  openAuthModal: (mode = 'login') => {
    console.log('Opening auth modal with mode:', mode)
    set({ 
      showAuthModal: true, 
      authMode: mode,
      error: null 
    })
  },

  closeAuthModal: () => {
    console.log('Closing auth modal')
    set({ 
      showAuthModal: false, 
      error: null 
    })
  },

  setAuthMode: (mode) => set({ authMode: mode }),

  // Remember Me設定
  setRememberMe: (remember) => set({ rememberMe: remember }),

  // ログアウト時の状態リセット
  reset: () => set({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    showAuthModal: false,
    authMode: 'login'
  }),

  // ユーザープロフィール更新
  updateUserProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  }))
}))