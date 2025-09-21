import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ja'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEvents } from '../../hooks/useEvents'
import EventRenderer from './EventRenderer'

// 日本語ロケールを設定
moment.locale('ja')
const localizer = momentLocalizer(moment)

const messages = {
  allDay: '終日',
  previous: '前へ',
  next: '次へ',
  today: '今日',
  month: '月',
  week: '週',
  day: '日',
  agenda: 'アジェンダ',
  date: '日付',
  time: '',
  event: 'イベント',
  noEventsInRange: 'この期間にイベントはありません',
  showMore: total => `他 ${total} 件`
}

function CalendarView({ onEventClick, onSelectSlot }) {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())
  
  const { data: events = [], isLoading } = useEvents()

  // イベントデータをカレンダー用に変換
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.date),
      end: new Date(event.date),
      resource: {
        ...event,
        color: event.category === '誕生日' ? '#f59e0b' : '#3b82f6'
      }
    }))
  }, [events])

  const handleSelectEvent = (event) => {
    if (onEventClick) {
      onEventClick(event.resource)
    }
  }

  const handleSelectSlot = (slotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo)
    }
  }

  const handleNavigate = (newDate) => {
    setDate(newDate)
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">カレンダー</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === 'month'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              月
            </button>
            <button
              onClick={() => setView('agenda')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === 'agenda'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              アジェンダ
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <style>
          {`
            .rbc-agenda-view .rbc-agenda-time-cell {
              display: none;
            }
            .rbc-agenda-view .rbc-agenda-event-cell {
              padding-left: 10px;
            }
          `}
        </style>
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            view={view}
            views={['month', 'agenda']}
            date={date}
            onView={handleViewChange}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            components={{
              event: EventRenderer
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.resource.color,
                borderColor: event.resource.color,
                color: 'white',
                borderRadius: '4px',
                border: 'none'
              }
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default CalendarView