import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { 
  BellIcon, 
  EnvelopeIcon, 
  ComputerDesktopIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import { useSimpleNotifications } from '../../hooks/useSimpleNotifications'
import { NOTIFICATION_DAYS_OPTIONS } from '../../lib/constants'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NotificationSettings({ onSave, onClose }) {
  const { notificationSettings, setNotificationSettings } = useSimpleNotifications()
  
  // ローカル状態として保持
  const [localSettings, setLocalSettings] = useState(notificationSettings)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  // notificationSettingsが変更されたらlocalSettingsを更新
  useEffect(() => {
    setLocalSettings(notificationSettings)
  }, [notificationSettings])

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('このブラウザはデスクトップ通知に対応していません')
      return
    }

    setIsRequestingPermission(true)
    
    try {
      const permission = await Notification.requestPermission()
      setLocalSettings(prev => ({
        ...prev,
        permission
      }))

      if (permission === 'granted') {
        alert('通知が許可されました！')
      } else {
        alert('通知が拒否されました。ブラウザの設定から変更できます。')
      }
    } catch (error) {
      console.error('通知許可の取得に失敗:', error)
      alert('通知許可の取得中にエラーが発生しました')
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const handleSave = () => {
    // 設定を保存
    setNotificationSettings(localSettings)
    onSave?.(localSettings)
    onClose?.()
  }

  const handleCancel = () => {
    // 変更を破棄
    setLocalSettings(notificationSettings)
    onClose?.()
  }

  const updateSettings = (category, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const updateTypes = (category, type, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        types: {
          ...prev[category].types,
          [type]: value
        }
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 mr-2" />
              通知設定
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 設定内容 */}
          <div className="space-y-6">
            {/* ブラウザ通知設定 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <h4 className="text-md font-medium text-gray-900">ブラウザ通知</h4>
                </div>
                <Switch
                  checked={localSettings.browser?.enabled || false}
                  onChange={(checked) => updateSettings('browser', 'enabled', checked)}
                  className={classNames(
                    localSettings.browser?.enabled ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={classNames(
                      localSettings.browser?.enabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>

              {localSettings.browser?.enabled && (
                <div className="space-y-4">
                  {/* 通知許可 */}
                  {(!('Notification' in window) || Notification.permission !== 'granted') && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-sm text-yellow-800 mb-2">
                        ブラウザ通知を有効にするには許可が必要です
                      </p>
                      <button
                        onClick={requestNotificationPermission}
                        disabled={isRequestingPermission}
                        className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 disabled:opacity-50"
                      >
                        {isRequestingPermission ? '許可を要求中...' : '通知を許可する'}
                      </button>
                    </div>
                  )}

                  {/* 通知タイミング */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      通知タイミング（何日前）
                    </label>
                    <select
                      value={localSettings.browser?.defaultDaysBefore || 1}
                      onChange={(e) => updateSettings('browser', 'defaultDaysBefore', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {NOTIFICATION_DAYS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 通知種類 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      通知するイベント
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localSettings.browser?.types?.birthday || false}
                          onChange={(e) => updateTypes('browser', 'birthday', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">誕生日</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localSettings.browser?.types?.anniversary || false}
                          onChange={(e) => updateTypes('browser', 'anniversary', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">記念日</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localSettings.browser?.types?.other || false}
                          onChange={(e) => updateTypes('browser', 'other', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">その他</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* メール通知設定 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-green-500" />
                  <h4 className="text-md font-medium text-gray-900">メール通知</h4>
                </div>
                <Switch
                  checked={localSettings.email?.enabled || false}
                  onChange={(checked) => updateSettings('email', 'enabled', checked)}
                  className={classNames(
                    localSettings.email?.enabled ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={classNames(
                      localSettings.email?.enabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>

              {localSettings.email?.enabled && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      メール通知機能は将来のアップデートで実装予定です
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CheckIcon className="h-4 w-4 inline mr-1" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings