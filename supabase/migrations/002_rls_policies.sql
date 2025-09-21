-- Memorial App - Row Level Security (RLS) Policies
-- ユーザーが自分のデータのみアクセス可能にする

-- RLS を有効化
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- persons テーブルのRLSポリシー
-- ユーザーは自分が作成した人物のみアクセス可能
CREATE POLICY "Users can view own persons" ON persons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own persons" ON persons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own persons" ON persons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own persons" ON persons
  FOR DELETE USING (auth.uid() = user_id);

-- events テーブルのRLSポリシー
-- ユーザーは自分の人物に紐づくイベントのみアクセス可能
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (
    person_id IN (
      SELECT id FROM persons WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (
    person_id IN (
      SELECT id FROM persons WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (
    person_id IN (
      SELECT id FROM persons WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (
    person_id IN (
      SELECT id FROM persons WHERE user_id = auth.uid()
    )
  );