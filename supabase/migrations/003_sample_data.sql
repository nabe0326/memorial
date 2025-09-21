-- Memorial App - Sample Data (開発用)
-- 注意: 本番環境では実行しないこと

-- サンプルユーザーID（実際の認証されたユーザーIDに置き換える必要があります）
-- この値は実際の開発時に auth.users テーブルから取得してください
-- INSERT INTO persons (user_id, name, relationship, memo) VALUES
-- ('実際のユーザーID', '田中太郎', '家族', '息子'),
-- ('実際のユーザーID', '佐藤花子', '友人', '大学時代の友人'),
-- ('実際のユーザーID', '山田次郎', '同僚', '同じ部署');

-- 注意事項：
-- 1. このファイルは参考用です
-- 2. 実際にデータを追加する際は、認証後にアプリケーションから追加してください
-- 3. 本番環境でこのファイルを実行してはいけません

-- サンプルデータの形式例（コメントアウト状態）
/*
-- persons テーブルへのサンプルデータ
INSERT INTO persons (user_id, name, relationship, memo) VALUES
('auth-user-id-here', '田中太郎', '家族', '長男'),
('auth-user-id-here', '佐藤花子', '友人', '大学時代の友人'),
('auth-user-id-here', '山田次郎', '同僚', '同じ部署の先輩');

-- events テーブルへのサンプルデータ（person_idは上記で作成されたIDを使用）
INSERT INTO events (person_id, title, date, category, memo) VALUES
('person-id-here', '田中太郎の誕生日', '2024-03-15', '誕生日', '30歳'),
('person-id-here', '佐藤花子の誕生日', '2024-07-22', '誕生日', ''),
('person-id-here', '山田次郎の誕生日', '2024-11-08', '誕生日', '');
*/