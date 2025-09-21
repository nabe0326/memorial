import { GiftIcon, CalendarIcon } from '@heroicons/react/24/outline'

function EventRenderer({ event }) {
  const eventData = event.resource

  return (
    <div className="flex items-center space-x-1 px-1 py-0.5 rounded text-xs text-white overflow-hidden">
      <div className="flex-shrink-0">
        {eventData.category === '誕生日' ? (
          <GiftIcon className="h-3 w-3" />
        ) : (
          <CalendarIcon className="h-3 w-3" />
        )}
      </div>
      <span className="truncate font-medium">
        {event.title}
      </span>
    </div>
  )
}

export default EventRenderer