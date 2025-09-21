import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

function SearchBar({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "イベントや人物名で検索...",
  showHistory = true,
  searchHistory = [],
  onSelectHistory,
  className = ""
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowHistoryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    if (onClear) {
      onClear()
    }
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (showHistory && searchHistory.length > 0 && !value) {
      setShowHistoryDropdown(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // 少し遅延を入れてクリック処理を可能にする
    setTimeout(() => setShowHistoryDropdown(false), 200)
  }

  const handleHistorySelect = (historyItem) => {
    onChange(historyItem)
    if (onSelectHistory) {
      onSelectHistory(historyItem)
    }
    setShowHistoryDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowHistoryDropdown(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            isFocused ? 'ring-1 ring-indigo-500 border-indigo-500' : ''
          }`}
        />

        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              title="クリア"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 検索履歴ドロップダウン */}
      {showHistoryDropdown && searchHistory.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
            最近の検索
          </div>
          {searchHistory.slice(0, 5).map((item, index) => (
            <button
              key={index}
              onClick={() => handleHistorySelect(item)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="flex items-center">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{item}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar