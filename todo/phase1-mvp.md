# Phase 1: MVP開発 (2週間)

基本的なCRUD機能とダッシュボードを実装し、動作するアプリケーションを完成させる。

## Week 1: 基盤構築・認証・Supabase

### Day 1-2: 環境構築とSupabase設定 ✅
- [x] Supabase プロジェクト作成
- [x] 環境変数設定 (.env.local)
- [x] データベーステーブル作成
  - [x] persons テーブル
  - [x] events テーブル
- [x] RLS（Row Level Security）ポリシー設定
- [x] Supabase 接続テスト

### Day 3-4: 認証システム実装 ✅
- [x] `lib/supabase.js` - Supabase クライアント設定
- [x] `hooks/useAuth.js` - 認証カスタムフック
- [x] `components/auth/LoginForm.jsx` - ログインフォーム
- [x] `components/auth/SignupForm.jsx` - 登録フォーム
- [x] `components/auth/AuthModal.jsx` - 認証モーダル
- [x] Google OAuth設定・実装
- [x] パスワードリセット機能
- [ ] ログイン状態管理（Zustand）

### Day 5: 基本レイアウト・ルーティング ✅
- [x] `components/common/Layout.jsx` - メインレイアウト
- [x] `components/common/Header.jsx` - ヘッダー（ナビゲーション）
- [x] `components/common/Sidebar.jsx` - サイドバー（モバイル対応）
- [x] React Router 設定
- [x] 保護されたルート実装
- [x] レスポンシブデザイン基盤

## Week 2: 人物・イベント管理とダッシュボード

### Day 6-7: 人物管理機能 ✅
- [x] `hooks/usePersons.js` - 人物データ管理フック
- [x] `components/persons/PersonCard.jsx` - 人物カード
- [x] `components/persons/PersonForm.jsx` - 人物登録・編集フォーム
- [x] `components/persons/PersonModal.jsx` - 人物モーダル
- [x] `pages/PersonList.jsx` - 人物一覧ページ
- [x] `pages/PersonDetail.jsx` - 人物詳細ページ
- [x] 人物CRUD操作実装
  - [x] 作成（Create）
  - [x] 読み取り（Read）
  - [x] 更新（Update）
  - [x] 削除（Delete）

### Day 8-9: イベント管理機能 🟡
- [x] `hooks/useEvents.js` - イベントデータ管理フック
- [ ] `components/events/EventCard.jsx` - イベントカード
- [ ] `components/events/EventForm.jsx` - イベント登録・編集フォーム
- [ ] `components/events/EventModal.jsx` - イベントモーダル
- [ ] `components/events/UpcomingEvents.jsx` - 直近イベント表示
- [x] イベントCRUD操作実装
- [x] 人物とイベントの関連付け
- [ ] 日付計算・表示ロジック（date-fns使用）

### Day 10: ダッシュボード実装 ✅
- [x] `pages/Dashboard.jsx` - ダッシュボードページ
- [x] `components/dashboard/WelcomeSection.jsx` - ウェルカムセクション（Dashboard内に統合）
- [x] `components/dashboard/QuickStats.jsx` - 統計情報表示（Dashboard内に統合）
- [x] `components/dashboard/RecentPersons.jsx` - 最近追加した人物（Dashboard内に統合）
- [x] 直近7日のイベント表示
- [x] データ集計・統計計算
- [x] ダッシュボードレイアウト最適化

## 共通実装タスク

### データ管理・状態管理 ✅
- [ ] `stores/appStore.js` - アプリケーション状態管理（未実装：Zustandの代わりにReact Query使用）
- [ ] `stores/authStore.js` - 認証状態管理（未実装：useAuthフック使用）
- [x] React Query設定・キャッシュ戦略
- [x] エラーハンドリング統一
- [x] ローディング状態管理

### UI/UX ✅
- [x] `components/common/LoadingSpinner.jsx` - ローディング表示（各コンポーネントに統合）
- [x] `components/common/ErrorBoundary.jsx` - エラー境界
- [x] `components/common/ConfirmDialog.jsx` - 確認ダイアログ（PersonModal等に統合）
- [x] Toast通知実装（react-hot-toast）
- [x] フォームバリデーション（Zod）
- [x] アクセシビリティ対応基本

### ユーティリティ ✅
- [x] `lib/utils.js` - 共通ユーティリティ関数
- [x] `lib/dateUtils.js` - 日付操作ユーティリティ
- [x] `lib/constants.js` - 定数定義
- [x] `hooks/useLocalStorage.js` - ローカルストレージフック

## Phase 1 完了条件

### 機能要件
- [x] ユーザー登録・ログイン・ログアウトが動作する
- [x] 人物の追加・編集・削除ができる
- [x] イベントの追加・編集・削除ができる（誕生日イベント）
- [x] ダッシュボードで直近のイベントが確認できる
- [x] 人物詳細でその人のイベント一覧が見られる

### 技術要件
- [x] レスポンシブデザイン（スマホ・タブレット・PC対応）
- [x] 基本的なエラーハンドリング
- [x] 適切なローディング状態表示
- [x] Supabase RLS によるセキュリティ確保

### テスト
- [x] 基本的な動作確認（手動テスト）
- [x] 各CRUD操作の動作確認
- [x] 認証フローの確認
- [x] レスポンシブデザインの確認

## Phase 1 後の状態
MVP として動作する記念日管理アプリが完成し、基本的な人物・イベント管理ができるようになる。