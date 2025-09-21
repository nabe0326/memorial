import { useState } from 'react'
import { CalendarDaysIcon, GiftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useUpcomingEvents, useDeleteEvent } from '../../hooks/useEvents'
import EventCard from './EventCard'
import EventModal from './EventModal'

function UpcomingEvents({ limit = 5, showAddButton = false, className = "" }) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  
  const { data: upcomingEvents = [], isLoading } = useUpcomingEvents(limit)
  const deleteEventMutation = useDeleteEvent()


  const handleEdit = (event) => {
    setEditingEvent(event)
    setIsEventModalOpen(true)
  }

  const handleDelete = async (eventId) => {
    try {
      await deleteEventMutation.mutateAsync(eventId)
    } catch (error) {
      console.error('Delete event error:', error)
    }
  }

  const handleModalClose = () => {
    setIsEventModalOpen(false)
    setEditingEvent(null)
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">直近のイベント</h2>
        {showAddButton && (
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            イベント追加
          </button>
        )}
      </div>

      {/* イベント一覧 */}
      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showPersonName={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            直近のイベントがありません
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            新しいイベントを追加して、大切な日を管理しましょう
          </p>
          {showAddButton && (
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              最初のイベントを追加
            </button>
          )}
        </div>
      )}

      {/* イベント作成・編集モーダル */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleModalClose}
        event={editingEvent}
        title={editingEvent ? "イベントを編集" : "新しいイベントを追加"}
      />
    </div>
  )
}

export default UpcomingEvents