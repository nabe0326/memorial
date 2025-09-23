import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePersons } from '../../hooks/usePersons'

const eventSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  person_id: z.string().min(1, '人物を選択してください'),
  category: z.enum(['誕生日', '記念日', 'その他'], {
    errorMap: () => ({ message: 'カテゴリを選択してください' })
  }),
  date: z.string().min(1, '日付を入力してください'),
  description: z.string().optional(),
  notification_enabled: z.boolean(),
  notification_days_before: z.number().min(0).max(365),
})

function EventForm({ event, personId = null, initialDate = null, onSubmit, onCancel, isSubmitting = false }) {
  const { data: persons = [] } = usePersons()
  const [, setSelectedPerson] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      person_id: personId || '',
      category: '誕生日',
      date: initialDate || '',
      description: '',
      notification_enabled: true,
      notification_days_before: 1,
    }
  })

  const watchedPersonId = watch('person_id')
  const watchedCategory = watch('category')
  const watchedNotificationEnabled = watch('notification_enabled')

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || '',
        person_id: event.person_id || '',
        category: event.category || '誕生日',
        date: event.date || '',
        description: event.description || '',
        notification_enabled: event.notification_enabled || true,
        notification_days_before: event.notification_days_before || 1,
      })
    } else if (personId || initialDate) {
      // 新規作成時にpersonIdまたはinitialDateが指定されている場合
      reset({
        title: '',
        person_id: personId || '',
        category: '誕生日',
        date: initialDate || '',
        description: '',
        notification_enabled: true,
        notification_days_before: 1,
      })
    }
  }, [event, personId, initialDate, reset])

  useEffect(() => {
    const person = persons.find(p => p.id === watchedPersonId)
    setSelectedPerson(person)
    
    if (person && watchedCategory === '誕生日' && !event) {
      setValue('title', `${person.name}の誕生日`)
    }
  }, [watchedPersonId, persons, watchedCategory, setValue, event])

  const handleFormSubmit = (data) => {
    console.log('Form submitted with data:', data)
    onSubmit({
      ...data,
      notification_days_before: data.notification_enabled ? data.notification_days_before : 0
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 人物選択 */}
      <div>
        <label htmlFor="person_id" className="block text-sm font-medium text-gray-700">
          人物 <span className="text-red-500">*</span>
        </label>
        <select
          id="person_id"
          {...register('person_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        >
          <option value="">人物を選択してください</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        {errors.person_id && (
          <p className="mt-1 text-sm text-red-600">{errors.person_id.message}</p>
        )}
      </div>

      {/* カテゴリ */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        >
          <option value="誕生日">誕生日</option>
          <option value="記念日">記念日</option>
          <option value="その他">その他</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category.message}
            {import.meta.env.DEV && (
              <span className="block text-xs mt-1">Debug: {JSON.stringify(errors.category)}</span>
            )}
          </p>
        )}
      </div>

      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          placeholder="イベントのタイトルを入力"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* 日付 */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          日付 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          placeholder="イベントの詳細や思い出などを入力"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* 通知設定 */}
      <div>
        <div className="flex items-center">
          <input
            id="notification_enabled"
            type="checkbox"
            {...register('notification_enabled')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="notification_enabled" className="ml-2 block text-sm text-gray-900">
            通知を有効にする
          </label>
        </div>
        
        {watchedNotificationEnabled && (
          <div className="mt-3">
            <label htmlFor="notification_days_before" className="block text-sm font-medium text-gray-700">
              何日前に通知しますか？
            </label>
            <select
              id="notification_days_before"
              {...register('notification_days_before', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[44px] py-2 px-3"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
            >
              <option value={0}>当日</option>
              <option value={1}>1日前</option>
              <option value={3}>3日前</option>
              <option value={7}>1週間前</option>
              <option value={14}>2週間前</option>
              <option value={30}>1ヶ月前</option>
            </select>
            {errors.notification_days_before && (
              <p className="mt-1 text-sm text-red-600">{errors.notification_days_before.message}</p>
            )}
          </div>
        )}
      </div>

      {/* ボタン */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : event ? '更新' : '作成'}
        </button>
      </div>
    </form>
  )
}

export default EventForm