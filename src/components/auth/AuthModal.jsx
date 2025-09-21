import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ResetPasswordForm from './ResetPasswordForm'

function AuthModal() {
  const { showAuthModal, authMode, closeAuthModal } = useAuthStore()

  // デバッグ用ログ
  console.log('AuthModal render:', { showAuthModal, authMode })

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return <LoginForm />
      case 'signup':
        return <SignupForm />
      case 'reset':
        return <ResetPasswordForm />
      default:
        return <LoginForm />
    }
  }

  if (!showAuthModal) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        {/* 閉じるボタン */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* フォーム */}
        <div className="mt-2">
          {renderForm()}
        </div>
      </div>
    </div>
  )
}

export default AuthModal