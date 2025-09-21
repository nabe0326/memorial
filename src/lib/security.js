// セキュリティ関連のユーティリティ関数

/**
 * HTMLエスケープ関数
 * XSS攻撃を防ぐためにHTMLの特殊文字をエスケープ
 */
export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') {
    return unsafe
  }
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * 入力値のサニタイゼーション
 * 余分な空白を削除し、長さ制限を適用
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 制御文字を削除
}

/**
 * メールアドレスの簡易バリデーション
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 日付の簡易バリデーション
 */
export function isValidDate(dateString) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

/**
 * SQLインジェクション対策用の文字列クリーニング
 * （Supabaseは自動的に保護しているが、念のため）
 */
export function cleanSqlString(input) {
  if (typeof input !== 'string') {
    return input
  }
  
  return input
    .replace(/['";\\]/g, '') // 危険な文字を削除
    .trim()
}

/**
 * ファイル名のサニタイゼーション
 */
export function sanitizeFileName(fileName) {
  if (typeof fileName !== 'string') {
    return 'file'
  }
  
  return fileName
    .replace(/[<>:"/\\|?*]/g, '') // Windowsで無効な文字を削除
    .replace(/\.\./g, '') // ディレクトリトラバーサル対策
    .trim()
    .slice(0, 255) // ファイル名の長さ制限
}

/**
 * CSRFトークンの生成（簡易版）
 */
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * 安全なランダム文字列の生成
 */
export function generateSecureToken(length = 32) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * URLのバリデーション
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 安全な文字列比較（タイミング攻撃対策）
 */
export function safeStringCompare(a, b) {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * 入力データの全体的なバリデーションと清浄化
 */
export function sanitizeEventData(eventData) {
  return {
    title: sanitizeInput(eventData.title, 100),
    description: sanitizeInput(eventData.description, 500),
    category: sanitizeInput(eventData.category, 50),
    date: isValidDate(eventData.date) ? eventData.date : null,
    person_id: typeof eventData.person_id === 'string' ? eventData.person_id : null,
    notification_enabled: Boolean(eventData.notification_enabled),
    notification_days_before: Math.max(0, Math.min(30, Number(eventData.notification_days_before) || 1))
  }
}

/**
 * 人物データの全体的なバリデーションと清浄化
 */
export function sanitizePersonData(personData) {
  return {
    name: sanitizeInput(personData.name, 50),
    relationship: sanitizeInput(personData.relationship, 50),
    memo: sanitizeInput(personData.memo, 1000),
    birth_date: isValidDate(personData.birth_date) ? personData.birth_date : null,
    photo_url: isValidUrl(personData.photo_url) ? personData.photo_url : null
  }
}