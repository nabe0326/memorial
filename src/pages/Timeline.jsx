import { useState } from 'react'
import TimelineView from '../components/timeline/TimelineView'
import EventModal from '../components/events/EventModal'
import { useUpdateEvent, useDeleteEvent } from '../hooks/useEvents'

function Timeline() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleEventEdit = (event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleEventDelete = async (eventId) => {
    await deleteEventMutation.mutateAsync(eventId)
  }

  const handleCloseModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  const handleSaveEvent = async (eventData) => {
    if (selectedEvent) {
      await updateEventMutation.mutateAsync({
        id: selectedEvent.id,
        ...eventData
      })
    }
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">タイムライン</h1>
          <p className="mt-2 text-sm text-gray-700">
            イベントを時系列で表示・管理します
          </p>
        </div>
      </div>

      <TimelineView 
        onEventClick={handleEventClick}
        onEventEdit={handleEventEdit}
        onEventDelete={handleEventDelete}
      />

      {isEventModalOpen && selectedEvent && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          onSave={handleSaveEvent}
          title="イベントを編集"
        />
      )}
    </div>
  )
}

export default Timeline