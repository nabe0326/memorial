-- Memorial App - Initial Database Schema
-- 人物・イベント管理のためのテーブル作成

-- 人物テーブル
CREATE TABLE IF NOT EXISTS persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) <= 30),
  relationship TEXT CHECK (relationship IN ('家族', '友人', '同僚', 'その他')),
  photo_url TEXT,
  memo TEXT CHECK (char_length(memo) <= 200),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- イベントテーブル
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES persons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  date DATE NOT NULL,
  category TEXT CHECK (category IN ('誕生日', '記念日', 'その他')) NOT NULL,
  repeat_type TEXT DEFAULT 'yearly' CHECK (repeat_type IN ('yearly', 'once')) NOT NULL,
  notification_settings JSONB DEFAULT '{"email": true, "browser": false, "days_before": [0, 1, 7]}'::jsonb,
  memo TEXT CHECK (char_length(memo) <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS persons_user_id_idx ON persons(user_id);
CREATE INDEX IF NOT EXISTS persons_relationship_idx ON persons(relationship);
CREATE INDEX IF NOT EXISTS events_person_id_idx ON events(person_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);

-- updated_at 自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- persons テーブルの updated_at 自動更新トリガー
CREATE OR REPLACE TRIGGER update_persons_updated_at 
  BEFORE UPDATE ON persons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- events テーブルの updated_at 自動更新トリガー
CREATE OR REPLACE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();