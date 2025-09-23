import { useState } from 'react'
import { CalendarDaysIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useEvents, useDeleteEvent } from '../hooks/useEvents'
import EventCard from '../components/events/EventCard'
import EventModal from '../components/events/EventModal'

function EventList() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  
  const { data: events = [], isLoading } = useEvents()
  const deleteEventMutation = useDeleteEvent()

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setIsEventModalOpen(true)
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventMutation.mutateAsync(eventId)
    } catch (error) {
      console.error('Delete event error:', error)
    }
  }

  const handleEventModalClose = () => {
    setIsEventModalOpen(false)
    setEditingEvent(null)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setIsEventModalOpen(true)
  }

  // フィルタリング
  const filteredEvents = events.filter(event => {
    if (filterCategory === 'all') return true
    return event.category === filterCategory
  })

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: '誕生日', label: '誕生日' },
    { value: '記念日', label: '記念日' },
    { value: 'その他', label: 'その他' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">イベント一覧</h1>
          <p className="text-gray-600">すべてのイベントを管理</p>
        </div>
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          新しいイベント
        </button>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilterCategory(category.value)}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterCategory === category.value
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {filteredEvents.length}件のイベント
          </span>
        </div>
      </div>

      {/* イベント一覧 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              showPersonName={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {filterCategory === 'all' ? 'イベントがありません' : `${categories.find(c => c.value === filterCategory)?.label}のイベントがありません`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            新しいイベントを追加して、大切な日を管理しましょう
          </p>
          <button
            onClick={handleAddEvent}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            最初のイベントを追加
          </button>
        </div>
      )}

      {/* イベント追加・編集モーダル */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        event={editingEvent || null}
        title={editingEvent ? "イベントを編集" : "新しいイベントを追加"}
      />
    </div>
  )
}

export default EventList