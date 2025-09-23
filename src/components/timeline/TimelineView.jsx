import { useState, useMemo } from 'react'
import { useEvents } from '../../hooks/useEvents'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import TimelineGroup from './TimelineGroup'

// Helper function to group array by key
function groupBy(array, keyFunction) {
  return array.reduce((result, item) => {
    const key = keyFunction(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
    return result
  }, {})
}

function TimelineView({ onEventClick, onEventEdit, onEventDelete }) {
  const [viewMode, setViewMode] = useState('month') // 'year', 'month'
  const { data: events = [], isLoading } = useEvents()

  // イベントを日付でグループ化
  const groupedEvents = useMemo(() => {
    if (!events.length) return {}

    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
    
    if (viewMode === 'year') {
      // 年でグループ化
      return groupBy(sortedEvents, (event) => 
        format(parseISO(event.date), 'yyyy年', { locale: ja })
      )
    } else {
      // 月でグループ化
      return groupBy(sortedEvents, (event) => 
        format(parseISO(event.date), 'yyyy年M月', { locale: ja })
      )
    }
  }, [events, viewMode])

  const groupedEntries = Object.entries(groupedEvents).sort((a, b) => b[0].localeCompare(a[0]))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg">
          まだイベントがありません
        </div>
        <p className="text-gray-500 mt-2">
          イベントを追加して記念日を管理しましょう
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h2 className="text-lg font-semibold text-gray-900">タイムライン</h2>
          <div className="flex items-center space-x-2 justify-center sm:justify-end">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'month'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              月表示
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'year'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              年表示
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-8">
          {groupedEntries.map(([period, periodEvents]) => (
            <TimelineGroup
              key={period}
              period={period}
              events={periodEvents}
              onEventClick={onEventClick}
              onEventEdit={onEventEdit}
              onEventDelete={onEventDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimelineView