import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCreateEvent, useUpdateEvent } from '../../hooks/useEvents'
import EventForm from './EventForm'

function EventModal({ isOpen, onClose, event = null, personId = null, initialDate = null, title = "新しいイベントを追加" }) {
  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()

  const isEditing = !!event
  const isSubmitting = createEventMutation.isPending || updateEventMutation.isPending

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await updateEventMutation.mutateAsync({
          id: event.id,
          ...formData
        })
      } else {
        await createEventMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      console.error('Event submission error:', error)
      // デバッグ用：詳細なエラー情報をログ出力
      if (error.message) {
        console.error('Error message:', error.message)
      }
      if (error.details) {
        console.error('Error details:', error.details)
      }
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* エラー表示 */}
                {(createEventMutation.error || updateEventMutation.error) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      {isEditing ? 'イベントの更新に失敗しました。' : 'イベントの作成に失敗しました。'}
                      もう一度お試しください。
                    </p>
                  </div>
                )}

                {/* フォーム */}
                <EventForm
                  event={event}
                  personId={personId}
                  initialDate={initialDate}
                  onSubmit={handleSubmit}
                  onCancel={handleClose}
                  isSubmitting={isSubmitting}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EventModal