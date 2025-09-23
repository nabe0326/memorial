// アプリケーション定数定義

// イベントカテゴリ
export const EVENT_CATEGORIES = {
  BIRTHDAY: '誕生日',
  ANNIVERSARY: '記念日',
  OTHER: 'その他'
}

// イベントカテゴリの配列（セレクトボックス等で使用）
export const EVENT_CATEGORY_OPTIONS = [
  { value: EVENT_CATEGORIES.BIRTHDAY, label: '誕生日' },
  { value: EVENT_CATEGORIES.ANNIVERSARY, label: '記念日' },
  { value: EVENT_CATEGORIES.OTHER, label: 'その他' }
]

// 人物の関係カテゴリ
export const RELATIONSHIP_CATEGORIES = {
  FAMILY: '家族',
  FRIEND: '友人',
  COLLEAGUE: '同僚',
  OTHER: 'その他'
}

// 人物の関係カテゴリの配列
export const RELATIONSHIP_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: RELATIONSHIP_CATEGORIES.FAMILY, label: '家族' },
  { value: RELATIONSHIP_CATEGORIES.FRIEND, label: '友人' },
  { value: RELATIONSHIP_CATEGORIES.COLLEAGUE, label: '同僚' },
  { value: RELATIONSHIP_CATEGORIES.OTHER, label: 'その他' }
]

// 通知タイミング（日数）
export const NOTIFICATION_DAYS_OPTIONS = [
  { value: 0, label: '当日' },
  { value: 1, label: '1日前' },
  { value: 3, label: '3日前' },
  { value: 7, label: '1週間前' },
  { value: 14, label: '2週間前' },
  { value: 30, label: '1ヶ月前' }
]

// 文字数制限
export const CHARACTER_LIMITS = {
  PERSON_NAME: 30,
  PERSON_MEMO: 200,
  EVENT_TITLE: 100,
  EVENT_MEMO: 100,
  EVENT_DESCRIPTION: 500
}

// ページネーション
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

// API設定
export const API_CONFIG = {
  TIMEOUT: 10000, // 10秒
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000 // 1秒
}

// ローカルストレージキー
export const STORAGE_KEYS = {
  THEME: 'memorial_theme',
  LANGUAGE: 'memorial_language',
  USER_PREFERENCES: 'memorial_user_preferences',
  LAST_VISITED_PAGE: 'memorial_last_visited_page'
}

// アプリケーション設定
export const APP_CONFIG = {
  APP_NAME: 'Memorial',
  APP_VERSION: '1.0.0',
  AUTHOR: 'Memorial Team',
  DESCRIPTION: '大切な人の記念日を管理するアプリケーション'
}

// 日付フォーマット
export const DATE_FORMATS = {
  DISPLAY: 'yyyy年M月d日',
  DISPLAY_SHORT: 'M/d',
  DISPLAY_WITH_TIME: 'yyyy年M月d日 HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
}

// 色テーマ
export const COLORS = {
  PRIMARY: '#4f46e5', // indigo-600
  PRIMARY_HOVER: '#4338ca', // indigo-700
  SECONDARY: '#6b7280', // gray-500
  SUCCESS: '#10b981', // emerald-500
  WARNING: '#f59e0b', // amber-500
  ERROR: '#ef4444', // red-500
  INFO: '#3b82f6', // blue-500
  
  // イベントカテゴリ別色
  BIRTHDAY: '#ec4899', // pink-500
  ANNIVERSARY: '#8b5cf6', // violet-500
  OTHER: '#06b6d4' // cyan-500
}

// レスポンシブブレークポイント（Tailwindに合わせる）
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
}

// ファイルアップロード設定
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
}

// バリデーションメッセージ
export const VALIDATION_MESSAGES = {
  REQUIRED: 'この項目は必須です',
  EMAIL_INVALID: '有効なメールアドレスを入力してください',
  PHONE_INVALID: '有効な電話番号を入力してください',
  DATE_INVALID: '有効な日付を入力してください',
  TOO_LONG: (max) => `${max}文字以内で入力してください`,
  TOO_SHORT: (min) => `${min}文字以上で入力してください`,
  PASSWORD_TOO_SHORT: 'パスワードは8文字以上で入力してください',
  PASSWORD_MISMATCH: 'パスワードが一致しません'
}

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

// クエリキー（React Query用）
export const QUERY_KEYS = {
  PERSONS: 'persons',
  PERSON: 'person',
  EVENTS: 'events',
  EVENT: 'event',
  UPCOMING_EVENTS: 'upcoming_events',
  USER_PROFILE: 'user_profile'
}

// ルートパス
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  AUTH: '/auth',
  PERSONS: '/persons',
  PERSON_DETAIL: '/persons/:id',
  EVENTS: '/events',
  CALENDAR: '/calendar',
  TIMELINE: '/timeline',
  SETTINGS: '/settings'
}

// モーダル/ダイアログのデフォルト設定
export const MODAL_CONFIG = {
  ANIMATION_DURATION: 300,
  BACKDROP_CLOSE: true,
  ESC_CLOSE: true
}

// トースト通知設定
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right',
  MAX_VISIBLE: 5
}