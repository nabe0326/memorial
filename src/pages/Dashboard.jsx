import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDaysIcon, UserGroupIcon, GiftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { usePersons } from '../hooks/usePersons'
import { useUpcomingEvents } from '../hooks/useEvents'
import PersonModal from '../components/persons/PersonModal'
import UpcomingEvents from '../components/events/UpcomingEvents'
import { EVENT_CATEGORIES } from '../types'

function Dashboard() {
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false)
  
  const { data: persons = [], isLoading: personsLoading } = usePersons()
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useUpcomingEvents()

  // 今月の誕生日を計算（メモ化）
  const thisMonthBirthdays = useMemo(() => {
    const today = new Date()
    return upcomingEvents.filter(event => {
      const eventDate = new Date(event.date)
      return event.category === EVENT_CATEGORIES.BIRTHDAY && 
             eventDate.getMonth() === today.getMonth()
    }).length
  }, [upcomingEvents])

  // 統計データ（メモ化）
  const stats = useMemo(() => [
    {
      name: '登録人数',
      value: persons.length,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      href: '/persons'
    },
    {
      name: '今後のイベント',
      value: upcomingEvents.length,
      icon: CalendarDaysIcon,
      color: 'bg-green-500',
      href: '/events'
    },
    {
      name: '今月の誕生日',
      value: thisMonthBirthdays,
      icon: GiftIcon,
      color: 'bg-pink-500',
      href: '/events'
    }
  ], [persons.length, upcomingEvents.length, thisMonthBirthdays])


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600">大切な人との記念日を管理しましょう</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personsLoading || eventsLoading ? '-' : stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 直近のイベント */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">直近のイベント</h2>
            <Link
              to="/events"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              すべて見る
            </Link>
          </div>
          <UpcomingEvents limit={5} showAddButton={persons.length > 0} />
        </div>

        {/* 最近追加された人物 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">最近追加された人物</h2>
              <Link
                to="/persons"
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                すべて見る
              </Link>
            </div>
          </div>
          <div className="p-6">
            {personsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : persons.length > 0 ? (
              <div className="space-y-4">
                {persons.slice(0, 5).map((person) => (
                  <Link
                    key={person.id}
                    to={`/persons/${person.id}`}
                    className="flex items-center space-x-4 hover:bg-gray-50 rounded-md p-2 -m-2"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-800">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {person.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {person.relationship || '関係未設定'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">人物が登録されていません</h3>
                <p className="mt-1 text-sm text-gray-500">
                  最初の人物を追加しましょう
                </p>
                <button
                  onClick={() => setIsPersonModalOpen(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  人物を追加
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      {persons.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsPersonModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新しい人物を追加
            </button>
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <CalendarDaysIcon className="h-4 w-4 mr-2" />
              イベントを管理
            </Link>
          </div>
        </div>
      )}

      {/* 人物追加モーダル */}
      <PersonModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
        title="新しい人物を追加"
      />
    </div>
  )
}

export default Dashboard