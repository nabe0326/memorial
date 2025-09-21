// 共通の型定義とPropTypes

// 人物の型
export const PERSON_RELATIONSHIPS = {
  FAMILY: '家族',
  FRIEND: '友人',
  COLLEAGUE: '同僚',
  OTHER: 'その他'
}

// イベントの型
export const EVENT_CATEGORIES = {
  BIRTHDAY: '誕生日',
  ANNIVERSARY: '記念日'
}

// 通知設定の型
export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  BROWSER: 'browser'
}

// デフォルト値
export const DEFAULT_VALUES = {
  PERSON: {
    name: '',
    relationship: '',
    memo: '',
    photo_url: null
  },
  EVENT: {
    title: '',
    date: '',
    category: EVENT_CATEGORIES.BIRTHDAY,
    description: '',
    notification_enabled: false,
    notification_days_before: 1
  },
  NOTIFICATION: {
    email: false,
    browser: false,
    days_before: [1]
  }
}

// バリデーション用の定数
export const VALIDATION_RULES = {
  PERSON: {
    NAME_MAX_LENGTH: 30,
    MEMO_MAX_LENGTH: 200
  },
  EVENT: {
    TITLE_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 300
  }
}

// UI関連の定数
export const UI_CONSTANTS = {
  COLORS: {
    FAMILY: 'text-red-500 bg-red-50',
    FRIEND: 'text-blue-500 bg-blue-50',
    COLLEAGUE: 'text-green-500 bg-green-50',
    OTHER: 'text-gray-500 bg-gray-50'
  },
  SIZES: {
    AVATAR_SM: 'h-8 w-8',
    AVATAR_MD: 'h-12 w-12',
    AVATAR_LG: 'h-16 w-16'
  }
}

// フォームのオプション
export const FORM_OPTIONS = {
  RELATIONSHIPS: [
    { value: '', label: '選択してください' },
    { value: PERSON_RELATIONSHIPS.FAMILY, label: PERSON_RELATIONSHIPS.FAMILY },
    { value: PERSON_RELATIONSHIPS.FRIEND, label: PERSON_RELATIONSHIPS.FRIEND },
    { value: PERSON_RELATIONSHIPS.COLLEAGUE, label: PERSON_RELATIONSHIPS.COLLEAGUE },
    { value: PERSON_RELATIONSHIPS.OTHER, label: PERSON_RELATIONSHIPS.OTHER }
  ],
  CATEGORIES: [
    { value: EVENT_CATEGORIES.BIRTHDAY, label: EVENT_CATEGORIES.BIRTHDAY },
    { value: EVENT_CATEGORIES.ANNIVERSARY, label: EVENT_CATEGORIES.ANNIVERSARY }
  ],
  NOTIFICATION_DAYS: [
    { value: 0, label: '当日' },
    { value: 1, label: '1日前' },
    { value: 3, label: '3日前' },
    { value: 7, label: '1週間前' },
    { value: 14, label: '2週間前' },
    { value: 30, label: '1ヶ月前' }
  ]
}

// ユーティリティ関数
export const getRelationshipStyle = (relationship) => {
  const styleMap = {
    [PERSON_RELATIONSHIPS.FAMILY]: UI_CONSTANTS.COLORS.FAMILY,
    [PERSON_RELATIONSHIPS.FRIEND]: UI_CONSTANTS.COLORS.FRIEND,
    [PERSON_RELATIONSHIPS.COLLEAGUE]: UI_CONSTANTS.COLORS.COLLEAGUE,
    [PERSON_RELATIONSHIPS.OTHER]: UI_CONSTANTS.COLORS.OTHER
  }
  return styleMap[relationship] || UI_CONSTANTS.COLORS.OTHER
}

export const getCategoryIcon = (category) => {
  return category === EVENT_CATEGORIES.BIRTHDAY ? '🎂' : '🎉'
}