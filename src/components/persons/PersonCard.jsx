import { Link } from 'react-router-dom'
import { memo } from 'react'
import { 
  UserCircleIcon, 
  CakeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import ActionButtons from '../common/ActionButtons'
import { RELATIONSHIP_CATEGORIES } from '../../lib/constants'

// 関係性のアイコンを取得
function getRelationshipIcon(relationship) {
  const iconMap = {
    [RELATIONSHIP_CATEGORIES.FAMILY]: HeartIcon,
    [RELATIONSHIP_CATEGORIES.FRIEND]: UserCircleIcon,
    [RELATIONSHIP_CATEGORIES.COLLEAGUE]: UserCircleIcon,
    [RELATIONSHIP_CATEGORIES.OTHER]: UserCircleIcon
  }
  return iconMap[relationship] || UserCircleIcon
}

// 関係性のスタイルを取得
function getRelationshipStyle(relationship) {
  const styleMap = {
    [RELATIONSHIP_CATEGORIES.FAMILY]: 'text-red-600 bg-red-50',
    [RELATIONSHIP_CATEGORIES.FRIEND]: 'text-blue-600 bg-blue-50',
    [RELATIONSHIP_CATEGORIES.COLLEAGUE]: 'text-green-600 bg-green-50',
    [RELATIONSHIP_CATEGORIES.OTHER]: 'text-gray-600 bg-gray-50'
  }
  return styleMap[relationship] || 'text-gray-600 bg-gray-50'
}

// 直近のイベントを取得
function getUpcomingEvent(events) {
  if (!events || events.length === 0) return null
  
  const now = new Date()
  const currentYear = now.getFullYear()
  
  const upcomingEvents = events
    .map(event => {
      const eventDate = new Date(event.date)
      // 今年の日付に変換
      const thisYearDate = new Date(currentYear, eventDate.getMonth(), eventDate.getDate())
      
      // 今年の日付が過ぎていたら来年の日付にする
      if (thisYearDate < now) {
        thisYearDate.setFullYear(currentYear + 1)
      }
      
      return {
        ...event,
        nextDate: thisYearDate,
        daysUntil: Math.ceil((thisYearDate - now) / (1000 * 60 * 60 * 24))
      }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
  
  return upcomingEvents[0] || null
}

function PersonCard({ person, onEdit, onDelete }) {
  const relationshipStyleColor = getRelationshipStyle(person.relationship)
  const RelationshipIcon = getRelationshipIcon(person.relationship)
  const upcomingEvent = getUpcomingEvent(person.events)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* ヘッダー部分 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* プロフィール画像またはアイコン */}
            <div className="flex-shrink-0">
              {person.photo_url ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={person.photo_url}
                  alt={person.name}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <Link
                to={`/persons/${person.id}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {person.name}
              </Link>
              
              {person.relationship && (
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${relationshipStyleColor}`}>
                    <RelationshipIcon className="h-3 w-3 mr-1" />
                    {person.relationship}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <ActionButtons
            onEdit={onEdit ? () => onEdit(person) : null}
            onDelete={onDelete ? () => onDelete(person) : null}
          />
        </div>

        {/* メモ */}
        {person.memo && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">{person.memo}</p>
          </div>
        )}

        {/* 直近のイベント */}
        {upcomingEvent && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CakeIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-900">
                  {upcomingEvent.title}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {upcomingEvent.daysUntil === 0 ? '今日' : 
                 upcomingEvent.daysUntil === 1 ? '明日' : 
                 `${upcomingEvent.daysUntil}日後`}
              </span>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-2 sm:gap-0">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <CalendarDaysIcon className="h-3 w-3 mr-1" />
              {person.events?.length || 0}件のイベント
            </span>
          </div>
          <span className="text-right">
            {formatDistanceToNow(new Date(person.created_at), { 
              addSuffix: true, 
              locale: ja 
            })}に追加
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(PersonCard)