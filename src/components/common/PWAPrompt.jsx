import { useState } from 'react'
import { XMarkIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import { usePWA } from '../../hooks/usePWA'

function PWAPrompt() {
  const { shouldShowInstallPrompt, installPWA, dismissInstallPrompt, isInstalled } = usePWA()
  const [isVisible, setIsVisible] = useState(true)

  if (!shouldShowInstallPrompt || isInstalled || !isVisible) {
    return null
  }

  const handleInstall = async () => {
    const success = await installPWA()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    dismissInstallPrompt()
    setIsVisible(false)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <DevicePhoneMobileIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">
              Memorial をインストール
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ホーム画面に追加して、いつでも簡単にアクセス
            </p>
            
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleInstall}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                インストール
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                後で
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAPrompt