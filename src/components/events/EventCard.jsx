import { useState, memo } from 'react'
import { CalendarIcon, GiftIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import ActionButtons from '../common/ActionButtons'
import DeleteConfirmModal from '../common/DeleteConfirmModal'

function EventCard({ event, onEdit, onDelete, showPersonName = true }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const eventDate = parseISO(event.date)
  const today = new Date()
  const isUpcoming = eventDate >= today
  const timeUntil = isUpcoming ? formatDistanceToNow(eventDate, { locale: ja, addSuffix: false }) : null

  const handleDelete = () => {
    onDelete(event.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 rounded-full p-2 ${
              event.category === '誕生日' ? 'bg-pink-100' : 'bg-blue-100'
            }`}>
              {event.category === '誕生日' ? (
                <GiftIcon className="h-5 w-5 text-pink-600" />
              ) : (
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 break-words">
                {event.title}
              </h3>
              {showPersonName && event.person_name && (
                <p className="text-sm text-gray-500">
                  {event.person_name}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {format(eventDate, 'yyyy年M月d日', { locale: ja })}
              </p>
              {isUpcoming && timeUntil && (
                <p className="text-xs text-indigo-600 font-medium">
                  あと{timeUntil}
                </p>
              )}
              {event.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
          
          <ActionButtons
            onEdit={onEdit ? () => onEdit(event) : null}
            onDelete={onDelete ? () => setShowDeleteConfirm(true) : null}
          />
        </div>

        {event.notification_enabled && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              通知: {event.notification_days_before}日前
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="イベントを削除"
        itemName={event.title}
      />
    </>
  )
}

export default memo(EventCard)