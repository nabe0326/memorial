import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../stores/authStore'

// バリデーションスキーマ
const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
})

function ResetPasswordForm() {
  const [resetSent, setResetSent] = useState(false)
  const { resetPassword, loading } = useAuth()
  const { setAuthMode } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data) => {
    const result = await resetPassword(data.email)
    
    if (result.success) {
      setResetSent(true)
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || 'パスワードリセットに失敗しました'
      })
    }
  }

  // リセットメール送信成功時の表示
  if (resetSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">メール送信完了</h2>
          <p className="mt-2 text-sm text-gray-600">
            パスワードリセットメールを送信しました
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>{getValues('email')}</strong> にパスワードリセットメールを送信しました。
            <br />
            メールに記載されたリンクをクリックして、新しいパスワードを設定してください。
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>メールが届かない場合は、以下をご確認ください：</p>
          <ul className="text-left space-y-1 text-xs">
            <li>• スパムフォルダを確認してください</li>
            <li>• メールアドレスに誤りがないか確認してください</li>
            <li>• しばらく時間をおいてから再度お試しください</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setResetSent(false)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            別のメールアドレスで再送信
          </button>
          
          <button
            onClick={() => setAuthMode('login')}
            className="w-full py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={() => setAuthMode('login')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          ログインに戻る
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">パスワードリセット</h2>
        <p className="mt-2 text-sm text-gray-600">
          登録済みのメールアドレスを入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="登録済みのメールアドレス"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* 説明テキスト */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-600">
            入力されたメールアドレス宛にパスワードリセット用のリンクを送信します。
            メールが届いたら、リンクをクリックして新しいパスワードを設定してください。
          </p>
        </div>

        {/* エラーメッセージ */}
        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? '送信中...' : 'リセットメールを送信'}
        </button>
      </form>

      {/* ログインリンク */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          パスワードを思い出した方は{' '}
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordForm