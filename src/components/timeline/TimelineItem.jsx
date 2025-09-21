import { useState } from 'react'
import { 
  CalendarIcon, 
  GiftIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon 
} from '@heroicons/react/24/outline'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

function TimelineItem({ event, onEdit, onDelete, onClick }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const eventDate = parseISO(event.date)
  const today = new Date()
  const isUpcoming = eventDate >= today
  const timeDistance = formatDistanceToNow(eventDate, { locale: ja, addSuffix: true })

  const handleDelete = () => {
    onDelete(event.id)
    setShowDeleteConfirm(false)
  }

  const handleItemClick = () => {
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <>
      <div className="relative">
        {/* タイムライン線 */}
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* タイムラインアイテム */}
        <div className="relative flex items-start space-x-4">
          {/* アイコン */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            event.category === '誕生日' ? 'bg-pink-100' : 'bg-blue-100'
          }`}>
            {event.category === '誕生日' ? (
              <GiftIcon className="h-4 w-4 text-pink-600" />
            ) : (
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            )}
          </div>

          {/* コンテンツ */}
          <div 
            className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleItemClick}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    event.category === '誕生日' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.category}
                  </span>
                </div>
                
                {event.person_name && (
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {event.person_name}
                  </div>
                )}
                
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {format(eventDate, 'yyyy年M月d日(E)', { locale: ja })}
                  <span className={`ml-2 text-xs ${isUpcoming ? 'text-green-600' : 'text-gray-400'}`}>
                    {timeDistance}
                  </span>
                </div>

                {event.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {event.notification_enabled && (
                  <div className="mt-2 text-xs text-indigo-600">
                    通知: {event.notification_days_before}日前
                  </div>
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex items-center space-x-1 ml-2">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(event)
                    }}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100"
                    title="編集"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(true)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                    title="削除"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">イベントを削除</h3>
            <p className="text-sm text-gray-500 mb-6">
              「{event.title}」を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TimelineItem