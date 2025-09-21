import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PencilIcon, TrashIcon, CalendarIcon, GiftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { usePerson, useDeletePerson } from '../hooks/usePersons'
import { useEventsByPersonId, useDeleteEvent } from '../hooks/useEvents'
import PersonModal from '../components/persons/PersonModal'
import EventCard from '../components/events/EventCard'
import EventModal from '../components/events/EventModal'

function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const { data: person, isLoading: personLoading, error: personError } = usePerson(id)
  const { data: events = [], isLoading: eventsLoading } = useEventsByPersonId(id)
  const deletePersonMutation = useDeletePerson()
  const deleteEventMutation = useDeleteEvent()

  const handleDelete = async () => {
    try {
      await deletePersonMutation.mutateAsync(id)
      navigate('/persons')
    } catch (error) {
      console.error('Delete person error:', error)
    }
  }

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

  if (personLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (personError || !person) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">人物が見つかりません</p>
        <button
          onClick={() => navigate('/persons')}
          className="mt-4 text-indigo-600 hover:text-indigo-900"
        >
          人物一覧に戻る
        </button>
      </div>
    )
  }

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const nextYear = new Date(today.getFullYear() + 1, eventDate.getMonth(), eventDate.getDate())
    return eventDate >= today || nextYear >= today
  }).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/persons')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            編集
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            削除
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">名前</dt>
              <dd className="mt-1 text-sm text-gray-900">{person.name}</dd>
            </div>
            {person.nickname && (
              <div>
                <dt className="text-sm font-medium text-gray-500">ニックネーム</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.nickname}</dd>
              </div>
            )}
            {person.relationship && (
              <div>
                <dt className="text-sm font-medium text-gray-500">関係</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.relationship}</dd>
              </div>
            )}
            {person.email && (
              <div>
                <dt className="text-sm font-medium text-gray-500">メール</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.email}</dd>
              </div>
            )}
            {person.phone && (
              <div>
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.phone}</dd>
              </div>
            )}
            {person.address && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">住所</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.address}</dd>
              </div>
            )}
            {person.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">メモ</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{person.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* イベント管理セクション */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">イベント管理</h2>
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              イベント追加
            </button>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">総イベント数</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">{events.length}</dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">今後のイベント</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">{upcomingEvents.length}</dd>
            </div>
          </div>

          {/* イベント一覧 */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">イベント一覧</h3>
            {eventsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg p-4">
                      <div className="flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    showPersonName={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">イベントがありません</h4>
                <p className="mt-1 text-sm text-gray-500">
                  このユーザーの最初のイベントを追加しましょう
                </p>
                <button
                  onClick={handleAddEvent}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  イベントを追加
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 編集モーダル */}
      <PersonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        person={person}
        title="人物を編集"
      />

      {/* イベント追加・編集モーダル */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        event={editingEvent ? { ...editingEvent, person_id: editingEvent.person_id || id } : null}
        personId={id}
        title={editingEvent ? "イベントを編集" : "新しいイベントを追加"}
      />

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">削除の確認</h3>
            <p className="text-sm text-gray-500 mb-6">
              「{person.name}」を削除しますか？この操作は取り消せません。
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
                disabled={deletePersonMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deletePersonMutation.isPending ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonDetail