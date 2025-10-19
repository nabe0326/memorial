import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/common/Layout'
import ErrorBoundary from '../components/common/ErrorBoundary'
import AuthTestPage from '../components/AuthTestPage'
import { queryClient } from '../lib/queryClient'


// ページコンポーネントのインポート
import PersonList from '../pages/PersonList'
import Dashboard from '../pages/Dashboard'
import PersonDetail from '../pages/PersonDetail'
import EventList from '../pages/EventList'
import Calendar from '../pages/Calendar'
import Timeline from '../pages/Timeline'
import Search from '../pages/Search'
import Settings from '../pages/Settings'

// 保護されたルートコンポーネント
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

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

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function AppRouter() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          {/* 認証ページ */}
          <Route path="/auth" element={<AuthTestPage />} />

          {/* 保護されたルート */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* タイムライン（デフォルト） */}
            <Route index element={<Timeline />} />
            
            {/* 人物管理 */}
            <Route path="persons" element={<PersonList />} />
            <Route path="persons/:id" element={<PersonDetail />} />
            
            {/* イベント管理 */}
            <Route path="events" element={<EventList />} />
            
            {/* ダッシュボード */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* ビュー */}
            <Route path="calendar" element={<Calendar />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="search" element={<Search />} />
            
            {/* 設定 */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 認証コールバック（OAuth用） */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 404リダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast通知 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// OAuth認証コールバックページ
function AuthCallback() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証処理中...</p>
        </div>
      </div>
    )
  }

  return <Navigate to="/" replace />
}

export default AppRouter