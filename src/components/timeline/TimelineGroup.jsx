import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import TimelineItem from './TimelineItem'

function TimelineGroup({ period, events, onEventClick, onEventEdit, onEventDelete }) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!events || events.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* 期間ヘッダー */}
      <div className="sticky top-0 z-10 bg-white">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 w-full text-left py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{period}</h3>
            <p className="text-sm text-gray-500">
              {events.length}件のイベント
            </p>
          </div>
        </button>
      </div>

      {/* イベントリスト */}
      {isExpanded && (
        <div className="mt-4 space-y-4 pl-4">
          {events.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              onClick={onEventClick}
              onEdit={onEventEdit}
              onDelete={onEventDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TimelineGroup