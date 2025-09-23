# 要件定義書

# 誕生日・記念日管理Webアプリ 要件定義書

## 1. プロジェクト概要

### 1.1 アプリ名

（仮）メモリアル - 大切な人の記念日管理

### 1.2 コンセプト

**「大切な人を中心に記念日を管理する」**
人物を登録し、その人に関連する誕生日や記念日を管理。スマホでもPCでも使えるWebアプリケーション。

### 1.3 目的

- 大切な人の誕生日や記念日を忘れないようにする
- 人物単位で記念日を整理・管理する
- 適切なタイミングで通知を受け取る

### 1.4 ターゲットユーザー

- スマートフォン・PC・タブレットを使用している老若男女
- 家族、友人、同僚など多くの人間関係を持つ人
- デバイスを選ばずに記念日管理したい人

### 1.5 プラットフォーム

- **SPA（Single Page Application）**
- 対応ブラウザ：Chrome, Safari, Firefox, Edge（各最新版）
- モバイルファースト設計
- PWA対応（ホーム画面追加可能）

## 2. 機能要件

### 2.1 認証機能（Supabase Auth）

### 2.1.1 ユーザー登録

**機能内容**:

- メールアドレス/パスワードで登録
- Googleアカウント連携（OAuth）
- メール認証

### 2.1.2 ログイン/ログアウト

**機能内容**:

- メールアドレス/パスワードでログイン
- Googleアカウントでログイン
- 自動ログイン（Remember Me）

### 2.1.3 パスワードリセット

**機能内容**:

- Supabase標準のパスワードリセット機能

### 2.2 人物管理機能

### 2.2.1 人物登録

**画面**: 人物登録モーダル

**機能内容**:

- 新規人物情報の登録
- 誕生日を同時に登録可能（任意）

**入力項目**:

| 項目 | 必須/任意 | 仕様 |
| --- | --- | --- |
| 名前 | 必須 | 最大30文字 |
| 関係性 | 任意 | 選択式（家族/友人/同僚/その他） |
| 誕生日 | 任意 | 年月日 or 月日のみ |
| 誕生日通知 | 任意 | ON/OFF（デフォルトON） |
| メモ | 任意 | 最大200文字 |

### 2.3 イベント管理機能

### 2.3.1 イベント登録

**画面**: 記念日追加モーダル

**機能内容**:

- 人物に紐づくイベントの追加

**入力項目**:

| 項目 | 必須/任意 | 仕様 |
| --- | --- | --- |
| 対象人物 | 自動設定 | 人物詳細から遷移時に自動セット |
| 種類 | 必須 | 選択式（誕生日/記念日/その他） |
| 日付 | 必須 | 年月日 or 月日のみ |
| 繰り返し | 必須 | 毎年/今年のみ（デフォルト：毎年） |
| 通知設定 | 任意 | Edge Functionsで実装 |
| メモ | 任意 | 最大100文字 |

### 2.4 表示機能

### 2.4.1 ダッシュボード（メインページ）

**ルート**: `/`

**機能内容**:

- 直近の記念日を表示（7日以内）
- 人物カード一覧
- React Queryで最適化されたデータ取得

### 2.4.2 人物一覧ページ

**ルート**: `/persons`

**機能内容**:

- 登録済み人物をカード/リスト形式で表示
- 仮想スクロール（大量データ対応）
- リアルタイム検索

### 2.4.3 人物詳細ページ

**ルート**: `/persons/:id`

**機能内容**:

- 選択した人物の詳細情報表示
- 登録済みイベント一覧
- オプティミスティックUI更新

### 2.4.4 カレンダービュー

**ルート**: `/calendar`

**機能内容**:

- React Big Calendarで実装
- 月/週/日表示切替
- ドラッグ&ドロップでイベント移動

### 2.4.5 タイムラインビュー

**ルート**: `/timeline`

**機能内容**:

- Intersection Observerで無限スクロール
- 日付グルーピング表示

### 2.5 通知機能

### 2.5.1 通知システム

- **Supabase Edge Functions**でスケジューラー実装
- **Resend API**でメール送信
- **Web Push API**でブラウザ通知

## 3. 非機能要件

### 3.1 パフォーマンス要件

| 項目 | 要件 |
| --- | --- |
| 初回読み込み | 3秒以内（コード分割で最適化） |
| ページ遷移 | instant（クライアントサイドルーティング） |
| データ取得 | React Query でキャッシュ管理 |
| バンドルサイズ | 200KB以下（gzip） |

### 3.2 セキュリティ要件

- Supabase Row Level Security (RLS)
- JWT認証（Supabase Auth）
- 環境変数での機密情報管理
- Content Security Policy設定

## 4. 技術仕様

### 4.1 技術スタック

### フロントエンド

```jsx
{
  "dependencies": {
    // Core
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "vite": "^5.0.0",

    // State & Data
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",

    // Supabase
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-ui-react": "^0.4.0",

    // UI & Styling
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",

    // Forms & Validation
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",

    // Utilities
    "date-fns": "^2.30.0",
    "react-big-calendar": "^1.8.0",
    "react-hot-toast": "^2.4.0"
  }
}

```

### バックエンド（Supabase）

- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime（将来対応）
- **Edge Functions**: Deno（通知処理）

### 4.2 Supabaseテーブル設計

```sql
-- 人物テーブル
CREATE TABLE persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  photo_url TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- イベントテーブル
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES persons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT,
  repeat_type TEXT DEFAULT 'yearly',
  notification_settings JSONB DEFAULT '{"email": true, "days_before": [0, 1, 7]}'::jsonb,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) ポリシー
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own persons" ON persons
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON events
  FOR ALL USING (
    person_id IN (
      SELECT id FROM persons WHERE user_id = auth.uid()
    )
  );

```

### 4.3 プロジェクト構造

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── LoadingSpinner.jsx
│   ├── persons/
│   │   ├── PersonCard.jsx
│   │   ├── PersonForm.jsx
│   │   └── PersonDetail.jsx
│   └── events/
│       ├── EventCard.jsx
│       ├── EventForm.jsx
│       └── UpcomingEvents.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── PersonList.jsx
│   ├── PersonDetail.jsx
│   ├── Calendar.jsx
│   ├── Timeline.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useSupabase.js
│   ├── usePersons.js
│   └── useEvents.js
├── lib/
│   ├── supabase.js
│   └── utils.js
├── stores/
│   └── appStore.js
└── App.jsx

```

### 4.4 主要実装パターン

### Supabase接続

```jsx
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

```

### データ取得（React Query）

```jsx
// hooks/usePersons.js
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const usePersons = () => {
  return useQuery({
    queryKey: ['persons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('persons')
        .select(`
          *,
          events(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })
}

```

### 状態管理（Zustand）

```jsx
// stores/appStore.js
import { create } from 'zustand'

export const useAppStore = create((set) => ({
  filter: {
    relationship: 'all',
    searchTerm: ''
  },
  setFilter: (filter) => set({ filter }),
  selectedPerson: null,
  setSelectedPerson: (person) => set({ selectedPerson: person })
}))

```

## 5. デプロイ・運用

### 5.1 デプロイ方法

### オプション1: Vercel（推奨）

```bash
# ビルド設定
Build Command: npm run build
Output Directory: dist

```

### オプション2: Netlify

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

```

### 5.2 環境変数

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

```

## 6. リリース計画

### Phase 1（MVP）- 2週間

- Supabase セットアップ
- 認証機能実装
- 人物・イベントCRUD
- ダッシュボード
- レスポンシブ対応

### Phase 2 - 1週間

- カレンダービュー
- タイムライン
- 検索・フィルター
- パフォーマンス最適化

### Phase 3 - 1週間

- Edge Functionsで通知実装
- PWA対応
- テスト・デバッグ
- 本番リリース

## 7. 実装の利点

### Reactを選ぶメリット

1. **高速な開発**: コンポーネント再利用で効率的
2. **優れたUX**: SPAによるスムーズな画面遷移
3. **豊富なライブラリ**: React ecosystemの活用
4. **Supabaseとの相性**: リアルタイム機能も簡単実装

### Supabaseを選ぶメリット

1. **完全なBaaS**: Auth/DB/Storage全て込み
2. **無料枠が充実**: 初期は完全無料で運用可能
3. **スケーラブル**: 成長に合わせて拡張可能
4. **リアルタイム**: 将来的に共有機能も実装可能

---

**文書情報**

- バージョン: 5.0（React + Supabase版）
- 作成日: 2024年
- ステータス: 実装可能