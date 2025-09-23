import { Component } from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // エラーが発生した際にstateを更新してフォールバックUIを表示
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // エラーログを記録
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // 本番環境では、エラー監視サービス（Sentry等）にエラーを送信
    if (import.meta.env.PROD) {
      // TODO: エラー監視サービスへの送信
      // Sentry.captureException(error)
    }
  }

  handleRetry = () => {
    // エラー状態をリセットして再試行
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    // ページをリロード
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              予期しないエラーが発生しました
            </h1>
            
            <p className="text-gray-600 mb-6">
              申し訳ございません。アプリケーションでエラーが発生しました。
              下記のボタンで復旧を試してください。
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                再試行
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ページをリロード
              </button>
            </div>

            {/* 開発環境でのエラー詳細表示 */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  エラー詳細（開発用）
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    // エラーがない場合は通常の子コンポーネントを表示
    return this.props.children
  }
}

export default ErrorBoundary