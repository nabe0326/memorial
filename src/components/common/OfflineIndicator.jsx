import { WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePWA, useOfflineStorage } from '../../hooks/usePWA'

function OfflineIndicator() {
  const { isOnline } = usePWA()
  const { hasPendingData } = useOfflineStorage()

  if (isOnline && !hasPendingData) {
    return null
  }

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40">
      <div className={`px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 ${
        isOnline 
          ? 'bg-yellow-100 border border-yellow-300 text-yellow-800'
          : 'bg-red-100 border border-red-300 text-red-800'
      }`}>
        {isOnline ? (
          <>
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              同期待ちのデータがあります
            </span>
          </>
        ) : (
          <>
            <WifiIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              オフライン
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator