import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

// PWA関連の機能を管理するフック
export function usePWA() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [swRegistration, setSWRegistration] = useState(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  
  const [dismissedInstallPrompt, setDismissedInstallPrompt] = useLocalStorage('pwa-install-dismissed', false)
  const [installPromptCount, setInstallPromptCount] = useLocalStorage('pwa-install-prompt-count', 0)

  // オンライン/オフライン状態の監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // PWAインストール関連の処理
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Service Worker の登録
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
          setSWRegistration(registration)

          // アップデートのチェック
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  // PWA がインストール済みかどうかをチェック
  useEffect(() => {
    const checkIfInstalled = () => {
      // standalone モードで実行されているかチェック
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
      
      // iOS Safari の場合
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()
  }, [])

  // PWAインストールを実行
  const installPWA = useCallback(async () => {
    if (!installPrompt) {
      return false
    }

    try {
      const result = await installPrompt.prompt()
      console.log('PWA install prompt result:', result)
      
      if (result.outcome === 'accepted') {
        setInstallPromptCount(prev => prev + 1)
        setDismissedInstallPrompt(false)
      } else {
        setDismissedInstallPrompt(true)
      }
      
      setInstallPrompt(null)
      setIsInstallable(false)
      
      return result.outcome === 'accepted'
    } catch (error) {
      console.error('PWA installation failed:', error)
      return false
    }
  }, [installPrompt, setInstallPromptCount, setDismissedInstallPrompt])

  // インストールプロンプトを非表示にする
  const dismissInstallPrompt = useCallback(() => {
    setDismissedInstallPrompt(true)
  }, [setDismissedInstallPrompt])

  // アプリの更新を適用
  const updateApp = useCallback(() => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // ページをリロードして新しいバージョンを適用
      window.location.reload()
    }
  }, [swRegistration])

  // インストールプロンプトを表示すべきかどうか
  const shouldShowInstallPrompt = isInstallable && 
    !isInstalled && 
    !dismissedInstallPrompt && 
    installPromptCount < 3 // 最大3回まで表示

  return {
    // 状態
    isOnline,
    isInstallable,
    isInstalled,
    updateAvailable,
    shouldShowInstallPrompt,
    
    // データ
    swRegistration,
    installPromptCount,
    
    // アクション
    installPWA,
    dismissInstallPrompt,
    updateApp
  }
}

// PWAの機能をチェックするユーティリティ
export function checkPWASupport() {
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    manifest: 'manifest' in document.createElement('link'),
    standalone: window.matchMedia('(display-mode: standalone)').matches,
    notification: 'Notification' in window,
    pushMessaging: 'PushManager' in window,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    cache: 'caches' in window
  }

  const isFullySupported = Object.values(support).every(Boolean)
  
  return {
    ...support,
    isFullySupported
  }
}

// オフライン時のユーティリティ
export function useOfflineStorage() {
  const [offlineData, setOfflineData] = useLocalStorage('offline-data', {
    pendingEvents: [],
    pendingPersons: [],
    lastSync: null
  })

  const addOfflineEvent = useCallback((eventData) => {
    setOfflineData(prev => ({
      ...prev,
      pendingEvents: [...prev.pendingEvents, {
        ...eventData,
        id: `offline-${Date.now()}`,
        timestamp: new Date().toISOString()
      }]
    }))
  }, [setOfflineData])

  const addOfflinePerson = useCallback((personData) => {
    setOfflineData(prev => ({
      ...prev,
      pendingPersons: [...prev.pendingPersons, {
        ...personData,
        id: `offline-${Date.now()}`,
        timestamp: new Date().toISOString()
      }]
    }))
  }, [setOfflineData])

  const clearOfflineData = useCallback(() => {
    setOfflineData({
      pendingEvents: [],
      pendingPersons: [],
      lastSync: new Date().toISOString()
    })
  }, [setOfflineData])

  const hasPendingData = offlineData.pendingEvents.length > 0 || offlineData.pendingPersons.length > 0

  return {
    offlineData,
    addOfflineEvent,
    addOfflinePerson,
    clearOfflineData,
    hasPendingData
  }
}