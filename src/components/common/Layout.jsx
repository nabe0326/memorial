import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用サイドバー */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* デスクトップ用サイドバー */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* メインコンテンツエリア */}
      <div className="lg:pl-72">
        {/* ヘッダー */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* メインコンテンツ */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout