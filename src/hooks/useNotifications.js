// このファイルは無効化されました。useSimpleNotificationsを使用してください。

// ブラウザ通知の管理フック（無効化）
export function useNotifications() {
  return {
    notificationPermission: 'default',
    canUseNotifications: false,
    hasPermission: false,
    isEnabled: false,
    notificationSettings: { browser: { enabled: false }, email: { enabled: false } },
    requestNotificationPermission: () => Promise.resolve('default'),
    sendBrowserNotification: () => null,
    sendTestNotification: () => null,
    sendEventNotification: () => null,
    sendEventNotifications: () => 0,
    checkForNotifications: () => 0,
    getTodayNotifications: () => [],
    updateNotificationSettings: () => {}
  }
}

// 通知の自動チェック機能付きフック（無効化）
export function useAutoNotifications() {
  return {
    notificationPermission: 'default',
    canUseNotifications: false,
    hasPermission: false,
    isEnabled: false,
    notificationSettings: {},
    isChecking: false
  }
}