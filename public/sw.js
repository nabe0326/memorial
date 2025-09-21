const CACHE_NAME = 'memorial-v1.0.0'
const STATIC_CACHE_NAME = 'memorial-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'memorial-dynamic-v1.0.0'

// キャッシュするリソース
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Viteが生成するアセットは動的に追加される
]

// インストール時の処理
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static resources')
        return cache.addAll(STATIC_RESOURCES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        // 新しいService Workerをすぐにアクティブにする
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // すべてのクライアントを制御下に置く
      self.clients.claim()
    ])
  )
})

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return
  }

  // API リクエストの場合は Network First 戦略
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request))
    return
  }

  // HTMLページの場合は Network First 戦略（オフライン時はキャッシュから返す）
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithFallback(request))
    return
  }

  // 静的リソース（CSS, JS, 画像等）の場合は Cache First 戦略
  event.respondWith(cacheFirst(request))
})

// Cache First 戦略: キャッシュを優先、ない場合はネットワーク
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    
    // 成功したレスポンスをキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache First strategy failed:', error)
    
    // オフライン時のフォールバック
    if (request.destination === 'image') {
      return new Response('', { status: 200, statusText: 'Offline Image' })
    }
    
    throw error
  }
}

// Network First 戦略: ネットワークを優先、失敗時はキャッシュ
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    // 成功したレスポンスをキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Network First with Fallback 戦略: ネットワーク優先、失敗時はキャッシュ、それもなければオフラインページ
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request)
    
    // 成功したレスポンスをキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // オフライン用のフォールバックページ
    const offlineResponse = await caches.match('/')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // 最後の手段: 基本的なオフラインページを返す
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Memorial - オフライン</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h1>オフラインです</h1>
          <p>インターネット接続を確認してからもう一度お試しください。</p>
          <button onclick="window.location.reload()">再読み込み</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// プッシュ通知の処理
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received')
  
  const options = {
    body: 'Memorial からの通知です',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '確認する',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/icons/icon-192x192.png'
      }
    ]
  }

  let title = 'Memorial'
  let body = 'Memorial からの通知です'

  if (event.data) {
    try {
      const data = event.data.json()
      title = data.title || title
      body = data.body || body
      if (data.icon) options.icon = data.icon
      if (data.tag) options.tag = data.tag
      if (data.url) options.data.url = data.url
    } catch (error) {
      console.error('Failed to parse push data:', error)
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      ...options,
      body
    })
  )
})

// 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // 既に開いているタブがあるかチェック
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      
      // 新しいタブを開く
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event received')
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync')
  
  try {
    // ここでオフライン時に蓄積されたデータを同期する処理を実装
    // 例: 未送信のイベント作成リクエストを送信
    
    console.log('Service Worker: Background sync completed')
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
    throw error
  }
}