import { useState, useEffect } from 'react'
import { testSupabaseConnection, checkTablesExist, testRLSPolicies } from '../lib/supabase-test.js'

function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [tablesStatus, setTablesStatus] = useState(null)
  const [rlsStatus, setRlsStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    
    // 接続テスト
    const connectionResult = await testSupabaseConnection()
    setConnectionStatus(connectionResult)
    
    // テーブル存在確認
    const tablesResult = await checkTablesExist()
    setTablesStatus(tablesResult)
    
    // RLS テスト
    const rlsResult = await testRLSPolicies()
    setRlsStatus(rlsResult)
    
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Supabase 接続テスト
        </h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '테스ト 중...' : 'テスト再実行'}
        </button>

        {/* 接続テスト結果 */}
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">1. 基本接続テスト</h2>
            {connectionStatus ? (
              <div>
                <div className={`px-3 py-1 rounded text-sm ${
                  connectionStatus.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {connectionStatus.success ? '✅ 接続成功' : '❌ 接続失敗'}
                </div>
                {connectionStatus.error && (
                  <p className="mt-2 text-red-600 text-sm">
                    エラー: {connectionStatus.error}
                  </p>
                )}
                {connectionStatus.user && (
                  <p className="mt-2 text-gray-600 text-sm">
                    ログイン中: {connectionStatus.user.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-gray-500">テスト中...</div>
            )}
          </div>

          {/* テーブル存在確認結果 */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">2. テーブル存在確認</h2>
            {tablesStatus ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    tablesStatus.persons ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    persons テーブル: {tablesStatus.persons ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    tablesStatus.events ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    events テーブル: {tablesStatus.events ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">テスト中...</div>
            )}
          </div>

          {/* RLS テスト結果 */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">3. RLS ポリシーテスト</h2>
            {rlsStatus ? (
              <div>
                <div className={`px-3 py-1 rounded text-sm ${
                  rlsStatus.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rlsStatus.success ? '✅ RLS 正常' : '⚠️ 認証が必要'}
                </div>
                {rlsStatus.error && (
                  <p className="mt-2 text-yellow-600 text-sm">
                    {rlsStatus.message || rlsStatus.error}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-gray-500">テスト中...</div>
            )}
          </div>
        </div>

        {/* 次のステップ案内 */}
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">次のステップ:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Supabaseプロジェクトが作成されていることを確認</li>
            <li>.env.local ファイルに正しいURL・APIキーが設定されていることを確認</li>
            <li>Supabase管理画面でSQL EditorからテーブルCREATE文を実行</li>
            <li>RLSポリシーが正しく設定されていることを確認</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SupabaseTest