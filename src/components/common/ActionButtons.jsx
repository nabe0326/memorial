import { memo } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Button from './Button'

function ActionButtons({ onEdit, onDelete, editTitle = '編集', deleteTitle = '削除' }) {
  return (
    <div className="flex items-center space-x-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          icon={PencilIcon}
          onClick={onEdit}
          title={editTitle}
        />
      )}
      {onDelete && (
        <Button
          variant="ghost-danger"
          size="icon"
          icon={TrashIcon}
          onClick={onDelete}
          title={deleteTitle}
        />
      )}
    </div>
  )
}

export default memo(ActionButtons)