import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BellIcon, 
  UserIcon, 
  Cog6ToothIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  TrashIcon 
} from '@heroicons/react/24/outline'
import NotificationSettings from '../components/notifications/NotificationSettings'
import { useSimpleNotifications } from '../hooks/useSimpleNotifications'
import { useAuth } from '../hooks/useAuth'

function Settings() {
  const [activeSection, setActiveSection] = useState('notifications')
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const navigate = useNavigate()
  const notifications = useSimpleNotifications()
  const { user, deleteAccount, loading: authLoading, isAuthenticated } = useAuth()

  // 認証状態が変更された場合（削除によりログアウトされた場合）のリダイレクト
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth')
    }
  }, [authLoading, isAuthenticated, navigate])

  const sections = [
    {
      id: 'notifications',
      name: '通知設定',
      icon: BellIcon,
      description: '通知の設定'
    },
    {
      id: 'profile',
      name: 'プロフィール',
      icon: UserIcon,
      description: 'アカウント情報'
    },
    {
      id: 'appearance',
      name: '外観',
      icon: PaintBrushIcon,
      description: 'テーマ設定'
    },
    {
      id: 'privacy',
      name: 'プライバシー',
      icon: ShieldCheckIcon,
      description: 'プライバシー設定'
    },
    {
      id: 'general',
      name: '一般',
      icon: Cog6ToothIcon,
      description: 'その他設定'
    }
  ]

  const handleNotificationSettingsSave = (settings) => {
    console.log('通知設定を保存:', settings)
    // ここで設定を保存する処理を実装
    setIsNotificationSettingsOpen(false)
  }

  const handleDeleteAccount = async (immediate = false) => {
    try {
      const deletionMode = immediate ? 'immediate' : 'delayed'
      const result = await deleteAccount(deletionMode)
      
      if (result.success) {
        let message = ''
        if (result.immediate) {
          message = 'アカウントが完全に削除されました'
          // 即座削除の場合は即座にログイン画面へ
          alert(message)
          navigate('/auth', { replace: true })
          return
        } else if (result.delayed) {
          const deletionDate = new Date(result.deletionDate).toLocaleDateString('ja-JP')
          message = `ユーザーデータを削除しました。認証アカウントは${deletionDate}に自動削除されます。それまでは再ログイン可能です。`
        } else if (result.fallback) {
          message = result.message || 'ユーザーデータを削除しました。認証アカウントは手動で削除してください。'
          // フォールバック削除の場合も即座にログイン画面へ
          alert(message)
          navigate('/auth', { replace: true })
          return
        } else {
          message = 'アカウントが削除されました'
        }
        
        alert(message)
        
        // 削除成功後、ログイン画面にリダイレクト
        setTimeout(() => {
          navigate('/auth', { replace: true })
        }, 1000) // 1秒後にリダイレクト
        
      } else {
        alert(`アカウント削除に失敗しました: ${result.error}`)
      }
    } catch (error) {
      console.error('Account deletion error:', error)
      alert('アカウント削除中にエラーが発生しました')
    }
    setShowDeleteConfirm(false)
  }

  const renderNotificationSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">通知設定</h3>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-medium text-gray-900">通知の管理</h4>
              <p className="text-sm text-gray-500 mt-1">
                通知方法を設定
              </p>
            </div>
            <button
              onClick={() => setIsNotificationSettingsOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              設定を開く
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <BellIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">ブラウザ通知</span>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  状態: {notifications.hasPermission ? (
                    notifications.isEnabled ? (
                      <span className="text-green-600 font-medium">有効</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">許可済み</span>
                    )
                  ) : notifications.canUseNotifications ? (
                    <span className="text-red-600 font-medium">未許可</span>
                  ) : (
                    <span className="text-gray-500 font-medium">非対応</span>
                  )}
                </p>
                
                {/* 通知許可ボタン */}
                {!notifications.hasPermission && notifications.canUseNotifications && (
                  <button
                    onClick={async () => {
                      try {
                        const success = await notifications.enableBrowserNotifications()
                        if (success) {
                          alert('通知が有効になりました！')
                        } else {
                          alert('通知を有効にできませんでした。')
                        }
                      } catch (error) {
                        console.error('Notification permission error:', error)
                        alert('通知許可の取得中にエラーが発生しました。')
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    通知を許可
                  </button>
                )}

                {/* テスト通知ボタン */}
                {notifications.hasPermission && (
                  <button
                    onClick={() => {
                      const result = notifications.sendTestNotification()
                      if (result) {
                        alert('テスト通知を送信しました')
                      } else {
                        alert('通知の送信に失敗しました')
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    テスト通知
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">📧 メール通知</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">
                  状態: <span className="text-yellow-600 font-medium">開発中</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Supabase Edge Functions実装予定
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">プロフィール</h3>
        
        {/* ユーザー情報 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">アカウント情報</h4>
          {user && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">登録日</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* アカウント削除 */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <TrashIcon className="h-6 w-6 text-red-600 mt-1" />
            <div className="ml-4 flex-1">
              <h4 className="text-md font-medium text-gray-900 mb-2">アカウントの削除</h4>
              <p className="text-sm text-gray-600 mb-4">
                アカウントデータを削除すると、すべてのデータが完全に削除され、復元することはできません。
                この操作は取り消すことができませんので、慎重にご検討ください。
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={authLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                データを削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">外観設定</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500">ダークモードやテーマ設定は開発中です。</p>
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">プライバシー設定</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500">プライバシー設定は開発中です。</p>
        </div>
      </div>
    </div>
  )

  const renderGeneralSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">一般設定</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500">その他の設定は開発中です。</p>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'notifications':
        return renderNotificationSection()
      case 'profile':
        return renderProfileSection()
      case 'appearance':
        return renderAppearanceSection()
      case 'privacy':
        return renderPrivacySection()
      case 'general':
        return renderGeneralSection()
      default:
        return renderNotificationSection()
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">設定</h1>
          <p className="mt-2 text-sm text-gray-700">
            アプリケーションの設定を管理します
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* サイドバー */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <section.icon
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>

      {/* 通知設定モーダル */}
      {isNotificationSettingsOpen && (
        <NotificationSettings
          onSave={handleNotificationSettingsSave}
          onClose={() => setIsNotificationSettingsOpen(false)}
        />
      )}

      {/* アカウント削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">アカウントの削除</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                本当にアカウントを削除しますか？この操作は取り消すことができません。
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  <strong>注意:</strong> アカウントを削除すると、以下のデータがすべて失われます：
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li>登録した人物情報</li>
                  <li>記念日・イベント情報</li>
                  <li>通知設定</li>
                  <li>その他すべてのデータ</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleDeleteAccount(false)}
                  disabled={authLoading}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? '処理中...' : '7日後に削除（推奨）'}
                </button>
                <button
                  onClick={() => handleDeleteAccount(true)}
                  disabled={authLoading}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? '削除中...' : '即座に削除'}
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                ※7日後削除を選択した場合、期間内であれば再ログインで削除をキャンセルできます
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings