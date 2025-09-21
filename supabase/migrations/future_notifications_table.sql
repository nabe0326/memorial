-- 将来的な通知機能拡張用のテーブル案
-- 現在は作成不要だが、将来のFCM実装時に使用

-- FCMトークン管理テーブル（複数デバイス対応）
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  device_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT fcm_tokens_user_id_token_unique UNIQUE(user_id, token)
);

-- 通知履歴テーブル（送信済み通知の記録）
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  notification_type TEXT CHECK (notification_type IN ('email', 'browser', 'fcm')) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'failed', 'read')) DEFAULT 'sent' NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  read_at TIMESTAMPTZ
);

-- 通知設定テーブル（ユーザー全体の通知設定）
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_enabled BOOLEAN DEFAULT false NOT NULL,
  browser_enabled BOOLEAN DEFAULT true NOT NULL,
  fcm_enabled BOOLEAN DEFAULT false NOT NULL,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS fcm_tokens_user_id_idx ON fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS fcm_tokens_active_idx ON fcm_tokens(is_active);
CREATE INDEX IF NOT EXISTS notification_history_user_id_idx ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS notification_history_event_id_idx ON notification_history(event_id);
CREATE INDEX IF NOT EXISTS notification_history_sent_at_idx ON notification_history(sent_at);

-- RLSポリシー（Row Level Security）
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can manage their own FCM tokens" ON fcm_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notification history" ON notification_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notification preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);