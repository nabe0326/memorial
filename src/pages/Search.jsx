import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import SearchResults from '../components/search/SearchResults'
import FilterPanel from '../components/filter/FilterPanel'
import EventModal from '../components/events/EventModal'
import { useFilteredSearch } from '../hooks/useSearch'
import { useUpdateEvent } from '../hooks/useEvents'

function Search() {
  const navigate = useNavigate()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  const updateEventMutation = useUpdateEvent()
  
  const {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    results,
    isLoading
  } = useFilteredSearch()

  const handleEventClick = (event) => {
    if (event.type === 'event') {
      setSelectedEvent(event)
      setIsEventModalOpen(true)
    } else if (event.type === 'person') {
      navigate(`/persons/${event.id}`)
    }
  }

  const handlePersonClick = (person) => {
    navigate(`/persons/${person.id}`)
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
    <div className="space-y-6 px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">検索</h1>
          <p className="mt-2 text-sm text-gray-700">
            イベントや人物を検索・フィルタリングして管理します
          </p>
        </div>
      </div>

      {/* 検索バー */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="space-y-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
            placeholder="イベントや人物名、メモなどで検索..."
            className="w-full"
            showHistory={false}
            searchHistory={[]}
          />
          
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      {/* 検索結果 */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        query={query}
        onEventClick={handleEventClick}
        onPersonClick={handlePersonClick}
        hasActiveFilters={hasActiveFilters}
      />

      {/* イベント詳細モーダル */}
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

export default Search