import { useState } from 'react'
import { format } from 'date-fns'
import CalendarView from '../components/calendar/CalendarView'
import EventModal from '../components/events/EventModal'

function Calendar() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(format(slotInfo.start, 'yyyy-MM-dd'))
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
    setSelectedDate(null)
  }


  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">カレンダー</h1>
          <p className="mt-2 text-sm text-gray-700">
            イベントをカレンダー形式で表示・管理します
          </p>
        </div>
      </div>

      <CalendarView 
        onEventClick={handleEventClick}
        onSelectSlot={handleSelectSlot}
      />

      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          initialDate={selectedDate}
          title={selectedEvent ? "イベントを編集" : "新しいイベントを追加"}
        />
      )}
    </div>
  )
}

export default Calendar