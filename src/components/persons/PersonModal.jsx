import { XMarkIcon } from '@heroicons/react/24/outline'
import PersonForm from './PersonForm'
import { useCreatePerson, useUpdatePerson } from '../../hooks/usePersons'
import { useCreateEvent } from '../../hooks/useEvents'

function PersonModal({ isOpen, onClose, person = null, title }) {
  const createPersonMutation = useCreatePerson()
  const updatePersonMutation = useUpdatePerson()
  const createEventMutation = useCreateEvent()

  const isEdit = !!person

  const handleSubmit = async (personData, birthdayData) => {
    try {
      let savedPerson

      if (isEdit) {
        // 人物を更新
        savedPerson = await updatePersonMutation.mutateAsync({
          id: person.id,
          ...personData
        })
      } else {
        // 新規人物を作成
        savedPerson = await createPersonMutation.mutateAsync(personData)
      }

      // 誕生日データがある場合はイベントも作成
      if (birthdayData.hasBirthday && birthdayData.birthdayDate && savedPerson) {
        await createEventMutation.mutateAsync({
          person_id: savedPerson.id,
          title: `${savedPerson.name}の誕生日`,
          date: birthdayData.birthdayDate,
          category: '誕生日',
          repeat_type: 'yearly',
          notification_settings: {
            email: birthdayData.birthdayNotification,
            browser: false,
            days_before: [0, 1, 7]
          }
        })
      }

      onClose()
    } catch (error) {
      console.error('Person save error:', error)
      throw error
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-md shadow-lg w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー - 固定 */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200 z-10">
          <h3 className="text-lg font-medium text-gray-900">
            {title || (isEdit ? '人物を編集' : '人物を追加')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* フォーム - スクロール可能 */}
        <div className="p-5">
          <PersonForm
            person={person}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={createPersonMutation.isPending || updatePersonMutation.isPending || createEventMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}

export default PersonModal