import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../stores/authStore'
import AuthModal from './auth/AuthModal'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function AuthTestPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const { openAuthModal, showAuthModal, authMode } = useAuthStore()

  // デバッグ用ログ
  useEffect(() => {
    console.log('AuthTestPage state:', { showAuthModal, authMode, user, isAuthenticated })
  }, [showAuthModal, authMode, user, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    // 認証済みユーザーはタイムライン画面にリダイレクト
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
          {/* ロゴとタイトル */}
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">❤️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Memorial
            </h1>
            <p className="text-gray-600 text-sm">
              大切な人との記念日を管理
            </p>
          </div>
          
          {/* ボタン */}
          <div className="space-y-4">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </button>
            
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-3 px-4 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              新規登録
            </button>
          </div>
        </div>
      </div>
      
      <AuthModal />
    </div>
  )
}

export default AuthTestPage