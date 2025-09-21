import { Fragment } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { 
  ChevronDownIcon, 
  XMarkIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { usePersons } from '../../hooks/usePersons'
import { useEvents } from '../../hooks/useEvents'


function FilterPanel({ 
  filters, 
  onUpdateFilter, 
  onClearFilters, 
  hasActiveFilters,
  className = ""
}) {
  const { data: persons = [] } = usePersons()
  const { data: events = [] } = useEvents()

  // 実際にデータベースに存在するカテゴリを取得
  const availableCategories = [...new Set(events.map(e => e.category).filter(Boolean))]
  
  
  // 利用可能な関係性を取得
  const availableRelationships = [...new Set(persons.map(p => p.relationship).filter(Boolean))]
  

  const handleCategoryChange = (category, checked) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    
    onUpdateFilter('categories', newCategories)
  }

  const handleRelationshipChange = (relationship, checked) => {
    const newRelationships = checked
      ? [...filters.relationships, relationship]
      : filters.relationships.filter(r => r !== relationship)
    onUpdateFilter('relationships', newRelationships)
  }

  const handlePersonChange = (personId, checked) => {
    const newPersonIds = checked
      ? [...filters.personIds, personId]
      : filters.personIds.filter(id => id !== personId)
    onUpdateFilter('personIds', newPersonIds)
  }

  const handleDateRangeChange = (field, value) => {
    const newDateRange = {
      ...filters.dateRange,
      [field]: value ? new Date(value) : null
    }
    onUpdateFilter('dateRange', newDateRange)
  }

  return (
    <div className={className}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button 
              className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                hasActiveFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4" />
                <span>フィルター</span>
                {hasActiveFilters && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    適用中
                  </span>
                )}
              </div>
              <ChevronDownIcon
                className={`${open ? 'rotate-180' : ''} h-4 w-4 transition-transform`}
              />
            </Disclosure.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Disclosure.Panel className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="space-y-6">
                  {/* アクションボタン */}
                  {hasActiveFilters && (
                    <div className="flex justify-end">
                      <button
                        onClick={onClearFilters}
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        すべてクリア
                      </button>
                    </div>
                  )}

                  {/* カテゴリフィルター */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      イベントカテゴリ
                    </label>
                    <div className="space-y-2">
                      {availableCategories.length > 0 ? (
                        availableCategories.map((category) => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={(e) => handleCategoryChange(category, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">利用可能なカテゴリがありません</p>
                      )}
                    </div>
                  </div>

                  {/* 関係性フィルター */}
                  {availableRelationships.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        関係性
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {availableRelationships.map((relationship) => (
                          <label key={relationship} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.relationships.includes(relationship)}
                              onChange={(e) => handleRelationshipChange(relationship, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{relationship}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 人物フィルター */}
                  {persons.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        人物
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {persons.slice(0, 10).map((person) => (
                          <label key={person.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.personIds.includes(person.id)}
                              onChange={(e) => handlePersonChange(person.id, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <div className="ml-2 flex items-center space-x-2">
                              <UserIcon className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-700">{person.name}</span>
                              {person.relationship && (
                                <span className="text-xs text-gray-500">({person.relationship})</span>
                              )}
                            </div>
                          </label>
                        ))}
                        {persons.length > 10 && (
                          <p className="text-xs text-gray-500 mt-2">
                            他 {persons.length - 10} 人
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 日付範囲フィルター */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      日付範囲
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">開始日</label>
                        <input
                          type="date"
                          value={filters.dateRange?.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                          onChange={(e) => handleDateRangeChange('start', e.target.value)}
                          className="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">終了日</label>
                        <input
                          type="date"
                          value={filters.dateRange?.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                          onChange={(e) => handleDateRangeChange('end', e.target.value)}
                          className="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default FilterPanel