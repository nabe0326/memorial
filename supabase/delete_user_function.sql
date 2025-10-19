-- ユーザー削除用のSQL関数
-- この関数をSupabase SQL Editorで実行してください

CREATE OR REPLACE FUNCTION delete_current_user()
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
  
  -- 関連データを削除
  DELETE FROM public.events WHERE user_id = current_user_id;
  DELETE FROM public.persons WHERE user_id = current_user_id;
  
  -- auth.usersテーブルからユーザーを削除（管理者権限が必要）
  -- この部分はSupabaseの設定によって動作しない場合があります
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN json_build_object('success', true, 'message', 'User deleted successfully');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;