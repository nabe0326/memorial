import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../stores/authStore'

// バリデーションスキーマ
const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(6, 'パスワードは6文字以上で入力してください')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'パスワードは英数字を含む必要があります'),
  confirmPassword: z
    .string()
    .min(1, 'パスワード確認を入力してください'),
  terms: z
    .boolean()
    .refine(val => val === true, '利用規約に同意してください')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
})

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  
  const { signUp, signInWithGoogle, loading } = useAuth()
  const { setAuthMode, closeAuthModal } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  const onSubmit = async (data) => {
    const result = await signUp(data.email, data.password)
    
    if (result.success) {
      setSignupSuccess(true)
      // 確認メール送信成功のメッセージを表示
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || 'アカウント作成に失敗しました'
      })
    }
  }

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle()
    
    if (result.success) {
      // OAuth はリダイレクトするため、ここではモーダルを閉じない
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || 'Googleサインアップに失敗しました'
      })
    }
  }

  // サインアップ成功時の表示
  if (signupSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">アカウント作成完了</h2>
          <p className="mt-2 text-sm text-gray-600">
            確認メールを送信しました
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>{getValues('email')}</strong> に確認メールを送信しました。
            <br />
            メールに記載されたリンクをクリックしてアカウントを有効化してください。
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setAuthMode('login')}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ログインページに戻る
          </button>
          
          <button
            onClick={closeAuthModal}
            className="w-full py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            閉じる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">アカウント作成</h2>
        <p className="mt-2 text-sm text-gray-600">
          新しいアカウントを作成してください
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
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* パスワード */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6文字以上の英数字"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* パスワード確認 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード確認
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="パスワードを再入力"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* 利用規約同意 */}
        <div>
          <div className="flex items-start">
            <input
              {...register('terms')}
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              <span className="text-blue-600 hover:text-blue-500 cursor-pointer">利用規約</span>
              および
              <span className="text-blue-600 hover:text-blue-500 cursor-pointer">プライバシーポリシー</span>
              に同意します
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </div>

        {/* エラーメッセージ */}
        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* サインアップボタン */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? '処理中...' : 'アカウント作成'}
        </button>
      </form>

      {/* 区切り線 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">または</span>
        </div>
      </div>

      {/* Googleサインアップ */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Googleでサインアップ
      </button>

      {/* ログインリンク */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
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

export default SignupForm