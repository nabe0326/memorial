import { useState } from 'react'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePWA } from '../../hooks/usePWA'

function UpdatePrompt() {
  const { updateAvailable, updateApp } = usePWA()
  const [isVisible, setIsVisible] = useState(true)

  if (!updateAvailable || !isVisible) {
    return null
  }

  const handleUpdate = () => {
    updateApp()
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <ArrowPathIcon className="w-6 h-6 text-blue-100" />
          <div className="flex-1">
            <h3 className="text-sm font-medium">
              アップデートがあります
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              新しいバージョンが利用可能です
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-100 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 flex space-x-3">
          <button
            onClick={handleUpdate}
            className="inline-flex items-center px-3 py-2 border border-blue-500 text-sm leading-4 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            更新
          </button>
          <button
            onClick={handleDismiss}
            className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-blue-100 hover:text-white"
          >
            後で
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePrompt