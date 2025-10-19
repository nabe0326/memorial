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