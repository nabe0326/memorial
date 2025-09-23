import { 
  formatDistanceToNow, 
  format, 
  parseISO, 
  isToday, 
  isTomorrow, 
  addDays,
  startOfDay,
  endOfDay,
  isWithinInterval
} from 'date-fns'
import { ja } from 'date-fns/locale'

// 日付を日本語でフォーマット
export function formatDateJa(date, formatString = 'yyyy年M月d日') {
  return format(parseISO(date), formatString, { locale: ja })
}

// あと何日かを表示
export function getTimeUntil(dateString) {
  const eventDate = parseISO(dateString)
  
  if (isToday(eventDate)) {
    return '今日'
  } else if (isTomorrow(eventDate)) {
    return '明日'
  } else {
    const distance = formatDistanceToNow(eventDate, { locale: ja, addSuffix: false })
    return `あと${distance}`
  }
}

// 今日から指定日数以内のイベントを取得
export function getEventsInRange(events, days = 30) {
  const today = startOfDay(new Date())
  const endDate = endOfDay(addDays(today, days))
  
  return events.filter(event => {
    const eventDate = parseISO(event.date)
    return isWithinInterval(eventDate, { start: today, end: endDate })
  })
}

// 次の誕生日の年齢を計算
export function calculateAge(birthDate, targetDate = new Date()) {
  const birth = parseISO(birthDate)
  const target = new Date(targetDate)
  
  let age = target.getFullYear() - birth.getFullYear()
  const monthDiff = target.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// 次回の記念日の年数を計算
export function calculateYearsSince(startDate, targetDate = new Date()) {
  const start = parseISO(startDate)
  const target = new Date(targetDate)
  
  let years = target.getFullYear() - start.getFullYear()
  const monthDiff = target.getMonth() - start.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < start.getDate())) {
    years--
  }
  
  return years
}

// 今年の誕生日/記念日の日付を取得
export function getThisYearDate(originalDate) {
  const original = parseISO(originalDate)
  const currentYear = new Date().getFullYear()
  
  return new Date(currentYear, original.getMonth(), original.getDate())
}

// 次回の誕生日/記念日の日付を取得
export function getNextOccurrence(originalDate) {
  const thisYear = getThisYearDate(originalDate)
  const today = new Date()
  
  if (thisYear >= today) {
    return thisYear
  } else {
    // 今年のは過ぎているので来年の日付を返す
    return new Date(today.getFullYear() + 1, thisYear.getMonth(), thisYear.getDate())
  }
}

// イベントカテゴリに応じたアイコンクラスを取得
export function getEventIconClass(category) {
  switch (category) {
    case '誕生日':
      return 'text-pink-600 bg-pink-100'
    case '記念日':
      return 'text-purple-600 bg-purple-100'
    default:
      return 'text-blue-600 bg-blue-100'
  }
}

// 緊急度に応じた色クラスを取得
export function getUrgencyClass(dateString) {
  const eventDate = parseISO(dateString)
  const today = new Date()
  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) {
    return 'bg-red-100 text-red-800'
  } else if (diffDays === 1) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (diffDays <= 7) {
    return 'bg-orange-100 text-orange-800'
  } else {
    return 'bg-blue-100 text-blue-800'
  }
}

// テスト用の追加関数
export function formatDateForDisplay(date) {
  return format(date, 'yyyy年M月d日', { locale: ja })
}

export function getUpcomingBirthdays(events, days = 30) {
  return getEventsInRange(
    events.filter(event => event.category === '誕生日'),
    days
  )
}

export function isEventToday(date) {
  return isToday(new Date(date))
}

export function daysBetween(date1, date2) {
  const diffTime = Math.abs(new Date(date2) - new Date(date1))
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}