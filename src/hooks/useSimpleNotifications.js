import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

// シンプルなブラウザ通知フック
export function useSimpleNotifications() {
  const [notificationSettings, setNotificationSettings] = useLocalStorage('notification-settings', {
    browser: { enabled: false },
    permission: 'default'
  })

  // 通知許可状態をチェック
  const checkNotificationPermission = useCallback(() => {
    if (!('Notification' in window)) {
      return 'unsupported'
    }
    return Notification.permission
  }, [])

  // 通知許可をリクエスト
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      throw new Error('このブラウザは通知をサポートしていません')
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationSettings(prev => ({
        ...prev,
        permission
      }))
      return permission
    } catch (error) {
      console.error('通知許可の取得に失敗:', error)
      throw error
    }
  }, [setNotificationSettings])

  // 直接通知を送信
  const sendNotification = useCallback((title, options = {}) => {
    if (!('Notification' in window)) {
      console.warn('このブラウザは通知をサポートしていません')
      return false
    }

    if (Notification.permission !== 'granted') {
      console.warn('通知の許可が得られていません')
      return false
    }

    try {
      const notification = new Notification(title, {
        body: options.body || '',
        icon: options.icon || '/favicon.ico',
        tag: options.tag || 'memorial-notification',
        requireInteraction: options.requireInteraction || false,
        ...options
      })

      // 通知クリック時の処理
      notification.onclick = () => {
        window.focus()
        notification.close()
        if (options.onClick) {
          options.onClick()
        }
      }

      // エラーハンドリング
      notification.onerror = (error) => {
        console.error('通知エラー:', error)
      }

      // 5秒後に自動で閉じる
      setTimeout(() => {
        notification.close()
      }, 5000)

      return true
    } catch (error) {
      console.error('通知の送信に失敗しました:', error)
      return false
    }
  }, [])

  // テスト通知を送信
  const sendTestNotification = useCallback(() => {
    return sendNotification('Memorial - テスト通知', {
      body: '通知機能が正常に動作しています！',
      icon: '/favicon.ico',
      tag: 'test-notification'
    })
  }, [sendNotification])

  // ブラウザ通知を有効化
  const enableBrowserNotifications = useCallback(async () => {
    try {
      const permission = await requestNotificationPermission()
      if (permission === 'granted') {
        setNotificationSettings(prev => ({
          ...prev,
          browser: { enabled: true },
          permission
        }))
        return true
      }
      return false
    } catch (error) {
      console.error('ブラウザ通知の有効化に失敗:', error)
      return false
    }
  }, [requestNotificationPermission, setNotificationSettings])

  // 通知状態
  const notificationPermission = checkNotificationPermission()
  const canUseNotifications = notificationPermission !== 'unsupported'
  const hasPermission = notificationPermission === 'granted'
  const isEnabled = notificationSettings.browser?.enabled && hasPermission

  // イベント通知を送信
  const sendEventNotification = useCallback((event) => {
    if (!isEnabled) return false
    
    const daysBeforeText = event.notification_days_before === 0 ? '今日' : `${event.notification_days_before}日前`
    const timeText = event.notification_time ? ` (${event.notification_time}設定)` : ''
    
    const title = `${event.person_name}さんの${event.category}`
    const body = `${event.title} - ${daysBeforeText}です！${timeText}`
    
    return sendNotification(title, {
      body,
      icon: event.category === '誕生日' ? '🎂' : '🎉',
      tag: `event-${event.id}`,
      onClick: () => {
        // イベント詳細ページに遷移
        window.location.href = `/events/${event.id}`
      }
    })
  }, [isEnabled, sendNotification])

  return {
    // 状態
    notificationPermission,
    canUseNotifications,
    hasPermission,
    isEnabled,
    notificationSettings,
    
    // アクション
    requestNotificationPermission,
    sendNotification,
    sendTestNotification,
    sendEventNotification,
    enableBrowserNotifications,
    setNotificationSettings
  }
}