import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserCircleIcon } from '@heroicons/react/24/outline'

// バリデーションスキーマ
const personSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(30, '名前は30文字以内で入力してください'),
  relationship: z
    .string()
    .optional(),
  memo: z
    .string()
    .max(200, 'メモは200文字以内で入力してください')
    .optional(),
  // 誕生日情報（オプション）
  hasBirthday: z.boolean().optional(),
  birthdayDate: z.string().optional(),
  birthdayNotification: z.boolean().optional()
})

// 関係性の選択肢
const relationshipOptions = [
  { value: '', label: '選択してください' },
  { value: '家族', label: '家族' },
  { value: '友人', label: '友人' },
  { value: '同僚', label: '同僚' },
  { value: 'その他', label: 'その他' }
]

function PersonForm({ person, onSubmit, onCancel, loading = false }) {
  const isEdit = !!person

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person?.name || '',
      relationship: person?.relationship || '',
      memo: person?.memo || '',
      hasBirthday: false,
      birthdayDate: '',
      birthdayNotification: true
    }
  })

  const hasBirthday = watch('hasBirthday')

  const handleFormSubmit = async (data) => {
    try {
      const personData = {
        name: data.name,
        relationship: data.relationship || null,
        memo: data.memo || null
      }

      await onSubmit(personData, {
        hasBirthday: data.hasBirthday,
        birthdayDate: data.birthdayDate,
        birthdayNotification: data.birthdayNotification
      })
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error.message || (isEdit ? '更新に失敗しました' : '登録に失敗しました')
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      {/* プロフィール画像（将来実装） */}
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
          <UserCircleIcon className="h-12 w-12 text-gray-400" />
        </div>
        <div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            disabled
          >
            写真を変更（今後実装）
          </button>
          <p className="text-xs text-gray-500 mt-1">
            JPG、PNG形式の画像を選択できます
          </p>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
        
        {/* 名前 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="田中太郎"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 関係性 */}
        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
            関係性
          </label>
          <select
            {...register('relationship')}
            id="relationship"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.relationship && (
            <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>
          )}
        </div>

        {/* メモ */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            {...register('memo')}
            id="memo"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="この人についてのメモを入力..."
          />
          {errors.memo && (
            <p className="mt-1 text-sm text-red-600">{errors.memo.message}</p>
          )}
        </div>
      </div>

      {/* 誕生日情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">誕生日情報</h3>
        
        {/* 誕生日を登録するかどうか */}
        <div className="flex items-center">
          <input
            {...register('hasBirthday')}
            id="hasBirthday"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasBirthday" className="ml-2 text-sm text-gray-700">
            誕生日を同時に登録する
          </label>
        </div>

        {/* デバッグ用表示 */}
        <div className="text-xs text-gray-500">
          デバッグ: hasBirthday = {hasBirthday ? 'true' : 'false'}
        </div>

        {/* 誕生日の詳細 */}
        {hasBirthday && (
          <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="birthdayDate" className="block text-sm font-medium text-gray-700 mb-1">
                誕生日
              </label>
              <input
                {...register('birthdayDate')}
                type="date"
                id="birthdayDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                {...register('birthdayNotification')}
                id="birthdayNotification"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="birthdayNotification" className="ml-2 text-sm text-gray-700">
                誕生日の通知を有効にする
              </label>
            </div>
          </div>
        )}
      </div>

      {/* エラーメッセージ */}
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.root.message}</p>
        </div>
      )}

      {/* ボタン */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? '処理中...' : (isEdit ? '更新' : '登録')}
        </button>
      </div>
    </form>
  )
}

export default PersonForm