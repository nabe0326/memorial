-- イベントカテゴリを更新するためのSQLコマンド
-- 手動でSupabaseのSQL Editorで実行してください

-- 1. 既存データを更新
UPDATE events 
SET category = '記念日' 
WHERE category = '結婚記念日';

UPDATE events 
SET category = 'その他' 
WHERE category = '命日';

-- 2. 既存のチェック制約を削除
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

-- 3. 新しいチェック制約を追加
ALTER TABLE events 
ADD CONSTRAINT events_category_check 
CHECK (category IN ('誕生日', '記念日', 'その他'));