import { useState } from 'react'

function SimpleAuthTest() {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('login')

  const openModal = (type) => {
    console.log('Opening modal:', type)
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    console.log('Closing modal')
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Memorial App - シンプルテスト
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={() => openModal('login')}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ログインモーダル開く
            </button>
            
            <button
              onClick={() => openModal('signup')}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              サインアップモーダル開く
            </button>

            <div className="mt-4 text-sm text-gray-600">
              <p>Modal状態: {showModal ? 'Open' : 'Closed'}</p>
              <p>Modal種類: {modalType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* シンプルモーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'login' ? 'ログイン' : 'サインアップ'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="メールアドレス"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                placeholder="パスワード"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {modalType === 'login' ? 'ログイン' : 'アカウント作成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleAuthTest