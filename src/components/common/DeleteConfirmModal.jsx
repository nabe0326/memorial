import { memo } from 'react'
import Button from './Button'

function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'アイテムを削除',
  message = 'この操作は取り消せません。',
  itemName = '',
  confirmText = '削除',
  cancelText = 'キャンセル'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {itemName && `「${itemName}」を削除しますか？`}
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(DeleteConfirmModal)