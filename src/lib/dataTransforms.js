// データベースとアプリケーション間のデータ変換ユーティリティ

// イベントデータの変換（DB → App）
export function transformEventFromDB(event) {
  return {
    ...event,
    person_name: event.persons?.name,
    description: event.memo || '',
    notification_enabled: event.notification_settings?.email || false,
    notification_days_before: event.notification_settings?.days_before?.[0] || 1
  }
}

// イベントデータの変換（App → DB）
export function transformEventToDB(eventData) {
  return {
    person_id: eventData.person_id,
    title: eventData.title,
    date: eventData.date,
    category: eventData.category,
    memo: eventData.description || '',
    notification_settings: {
      email: eventData.notification_enabled || false,
      browser: false,
      days_before: eventData.notification_enabled ? [eventData.notification_days_before || 1] : []
    }
  }
}

// イベント更新データの変換（App → DB）
export function transformEventUpdatesToDB(updates) {
  const dbUpdates = {}
  
  if ('person_id' in updates) dbUpdates.person_id = updates.person_id
  if ('title' in updates) dbUpdates.title = updates.title
  if ('date' in updates) dbUpdates.date = updates.date
  if ('category' in updates) dbUpdates.category = updates.category
  if ('description' in updates) dbUpdates.memo = updates.description || ''
  
  if ('notification_enabled' in updates || 'notification_days_before' in updates) {
    dbUpdates.notification_settings = {
      email: updates.notification_enabled !== undefined ? updates.notification_enabled : false,
      browser: false,
      days_before: (updates.notification_enabled && updates.notification_days_before) ? [updates.notification_days_before] : []
    }
  }
  
  return dbUpdates
}

// 共通のエラーメッセージ生成
export function getEventErrorMessage(error) {
  if (error.message.includes('person_id')) {
    return '人物を選択してください'
  } else if (error.message.includes('title')) {
    return 'タイトルを入力してください'
  } else if (error.message.includes('date')) {
    return '日付を入力してください'
  } else if (error.message.includes('category')) {
    return 'カテゴリを選択してください'
  } else if (error.message.includes('Row Level Security')) {
    return 'このイベントを編集する権限がありません'
  }
  return 'イベントの処理に失敗しました'
}