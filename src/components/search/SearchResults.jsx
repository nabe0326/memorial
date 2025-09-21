import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  CalendarIcon, 
  GiftIcon, 
  UserIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'

function SearchResults({ 
  results = [], 
  isLoading = false, 
  query = '', 
  onEventClick,
  onPersonClick,
  className = "",
  hasActiveFilters = false
}) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">検索中...</span>
        </div>
      </div>
    )
  }

  if (!query && !hasActiveFilters) {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 p-8 text-center ${className}`}>
        <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">キーワードを入力するか、フィルターを設定して検索してください</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 p-8 text-center ${className}`}>
        <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-900 font-medium">
          {query ? `「${query}」の検索結果` : 'フィルター結果'}
        </p>
        <p className="text-gray-500 mt-2">該当するイベントや人物が見つかりませんでした</p>
      </div>
    )
  }

  // 結果をタイプ別にグループ化
  const groupedResults = results.reduce((acc, item) => {
    if (item.type === 'event') {
      if (!acc.events) acc.events = []
      acc.events.push(item)
    } else if (item.type === 'person') {
      if (!acc.persons) acc.persons = []
      acc.persons.push(item)
    }
    return acc
  }, {})

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {query ? `「${query}」の検索結果` : 'フィルター結果'} ({results.length}件)
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {/* イベント結果 */}
        {groupedResults.events && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              イベント ({groupedResults.events.length}件)
            </h4>
            <div className="space-y-3">
              {groupedResults.events.map((event) => (
                <div
                  key={`event-${event.id}`}
                  onClick={() => onEventClick && onEventClick(event)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 rounded-full p-2 ${
                      event.category === '誕生日' ? 'bg-pink-100' : 'bg-blue-100'
                    }`}>
                      {event.category === '誕生日' ? (
                        <GiftIcon className="h-4 w-4 text-pink-600" />
                      ) : (
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </h5>
                      {event.person_name && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {event.person_name}
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {format(parseISO(event.date), 'yyyy年M月d日(E)', { locale: ja })}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 人物結果 */}
        {groupedResults.persons && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              人物 ({groupedResults.persons.length}件)
            </h4>
            <div className="space-y-3">
              {groupedResults.persons.map((person) => (
                <div
                  key={`person-${person.id}`}
                  onClick={() => onPersonClick && onPersonClick(person)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 rounded-full p-2 bg-gray-100">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {person.name}
                      </h5>
                      {person.relationship && (
                        <p className="text-xs text-gray-600 mt-1">
                          {person.relationship}
                        </p>
                      )}
                      {person.memo && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {person.memo}
                        </p>
                      )}
                      {person.events_count > 0 && (
                        <p className="text-xs text-indigo-600 mt-1">
                          {person.events_count}件のイベント
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults