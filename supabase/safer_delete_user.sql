-- より安全なユーザー削除アプローチ（認証ユーザー削除機能なし）
-- この関数をSupabase SQL Editorで実行してください

-- 1. ユーザーを削除済みとしてマークするテーブルを作成
CREATE TABLE IF NOT EXISTS public.deleted_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  deleted_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- RLS (Row Level Security) を有効化
ALTER TABLE public.deleted_users ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成（ユーザーは自分の削除記録のみ作成可能）
CREATE POLICY "Users can insert their own deletion record" ON public.deleted_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. ユーザーデータを削除して削除記録を作成する関数
CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  result json;
BEGIN
  -- 現在のユーザーIDを取得
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;
  
  -- 関連データを削除（ユーザーデータのみ、認証アカウントは触らない）
  DELETE FROM public.events WHERE user_id = current_user_id;
  DELETE FROM public.persons WHERE user_id = current_user_id;
  
  -- 削除記録を作成
  INSERT INTO public.deleted_users (user_id, ip_address, user_agent)
  VALUES (
    current_user_id,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  RETURN json_build_object('success', true, 'message', 'User data deleted successfully');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;