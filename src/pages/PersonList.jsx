import { useState, useMemo, useCallback, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePersons, useDeletePerson } from '../hooks/usePersons'
import PersonCard from '../components/persons/PersonCard'
import PersonModal from '../components/persons/PersonModal'
import { FORM_OPTIONS } from '../types'

// 画面サイズに応じたプレースホルダーテキストを生成
function useResponsivePlaceholder(defaultPlaceholder) {
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder)
  
  useEffect(() => {
    const updatePlaceholder = () => {
      const width = window.innerWidth
      
      if (width < 375) {
        setPlaceholder('名前で検索...')
      } else if (width < 430) {
        setPlaceholder('名前で検索...')
      } else {
        setPlaceholder(defaultPlaceholder)
      }
    }
    
    updatePlaceholder()
    window.addEventListener('resize', updatePlaceholder)
    
    return () => window.removeEventListener('resize', updatePlaceholder)
  }, [defaultPlaceholder])
  
  return placeholder
}

function PersonList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRelationship, setSelectedRelationship] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const searchPlaceholder = useResponsivePlaceholder('名前で検索...')

  const { data: persons = [], isLoading, error } = usePersons()
  const deletePersonMutation = useDeletePerson()

  // フィルタリングロジック（メモ化）
  const filteredPersons = useMemo(() => {
    return persons.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRelationship = selectedRelationship === 'all' || person.relationship === selectedRelationship
      return matchesSearch && matchesRelationship
    })
  }, [persons, searchTerm, selectedRelationship])

  // 関係性でのフィルタリングオプション（メモ化）
  const relationshipOptions = useMemo(() => [
    { value: 'all', label: 'すべて' },
    ...FORM_OPTIONS.RELATIONSHIPS.slice(1) // '選択してください'を除く
  ], [])

  const handleAddPerson = useCallback(() => {
    setEditingPerson(null)
    setShowModal(true)
  }, [])

  const handleEditPerson = useCallback((person) => {
    setEditingPerson(person)
    setShowModal(true)
  }, [])

  const handleDeletePerson = useCallback((person) => {
    setShowDeleteConfirm(person)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setEditingPerson(null)
  }, [])


  const confirmDelete = async () => {
    if (!showDeleteConfirm) return

    try {
      await deletePersonMutation.mutateAsync(showDeleteConfirm.id)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">データの読み込みに失敗しました: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">人物一覧</h1>
          <p className="mt-2 text-sm text-gray-700">
            大切な人を登録して記念日を管理しましょう
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddPerson}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            人物を追加
          </button>
        </div>
      </div>

      {/* フィルター・検索 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 検索 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-normal bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
              style={{ fontSize: '16px', lineHeight: '1.5' }}
            />
          </div>

          {/* 関係性フィルター */}
          <div>
            <select
              value={selectedRelationship}
              onChange={(e) => setSelectedRelationship(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {relationshipOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{persons.length}</div>
            <div className="text-sm text-gray-500">総人数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {persons.reduce((sum, person) => sum + (person.events?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">総イベント数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{filteredPersons.length}</div>
            <div className="text-sm text-gray-500">表示中</div>
          </div>
        </div>
      </div>

      {/* 人物一覧 */}
      {filteredPersons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {persons.length === 0 
              ? '人物が登録されていません' 
              : '検索条件に一致する人物が見つかりません'
            }
          </p>
          {persons.length === 0 && (
            <button
              onClick={handleAddPerson}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              最初の人物を追加
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPersons.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onEdit={handleEditPerson}
              onDelete={handleDeletePerson}
            />
          ))}
        </div>
      )}

      {/* 人物編集/追加モーダル */}
      <PersonModal
        isOpen={showModal}
        onClose={handleCloseModal}
        person={editingPerson}
      />

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">人物を削除</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>{showDeleteConfirm.name}</strong> を削除しますか？
                  <br />
                  関連するイベントも一緒に削除されます。
                </p>
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={deletePersonMutation.isPending}
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={deletePersonMutation.isPending}
                >
                  {deletePersonMutation.isPending ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonList