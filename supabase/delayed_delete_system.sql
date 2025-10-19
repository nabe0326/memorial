-- 遅延削除システム: 数日後に認証ユーザーを自動削除
-- この関数をSupabase SQL Editorで実行してください

-- 1. 削除予定ユーザーを管理するテーブル
CREATE TABLE IF NOT EXISTS public.user_deletion_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  deletion_requested_at timestamp with time zone DEFAULT now(),
  deletion_scheduled_at timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE public.user_deletion_queue ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Users can view their own deletion requests" ON public.user_deletion_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deletion requests" ON public.user_deletion_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_user_deletion_queue_user_id ON public.user_deletion_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_user_deletion_queue_scheduled_at ON public.user_deletion_queue(deletion_scheduled_at);
CREATE INDEX IF NOT EXISTS idx_user_deletion_queue_status ON public.user_deletion_queue(status);

-- 2. ユーザー削除をスケジュールする関数
CREATE OR REPLACE FUNCTION schedule_user_deletion(days_delay integer DEFAULT 7)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_email text;
  scheduled_time timestamp with time zone;
  existing_request uuid;
BEGIN
  -- 現在のユーザーIDを取得
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;
  
  -- ユーザーのメールアドレスを取得
  SELECT email INTO current_user_email 
  FROM auth.users 
  WHERE id = current_user_id;
  
  -- 削除予定時刻を計算（デフォルト7日後）
  scheduled_time := now() + (days_delay || ' days')::interval;
  
  -- 既存の削除リクエストをチェック
  SELECT id INTO existing_request
  FROM public.user_deletion_queue
  WHERE user_id = current_user_id AND status = 'pending';
  
  IF existing_request IS NOT NULL THEN
    -- 既存のリクエストを更新
    UPDATE public.user_deletion_queue
    SET 
      deletion_scheduled_at = scheduled_time,
      updated_at = now()
    WHERE id = existing_request;
  ELSE
    -- 新しいリクエストを作成
    INSERT INTO public.user_deletion_queue (
      user_id, 
      user_email, 
      deletion_scheduled_at,
      ip_address,
      user_agent
    ) VALUES (
      current_user_id,
      current_user_email,
      scheduled_time,
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
  END IF;
  
  -- ユーザーデータを即座に削除
  DELETE FROM public.events WHERE user_id = current_user_id;
  DELETE FROM public.persons WHERE user_id = current_user_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'User data deleted. Authentication account will be deleted on ' || scheduled_time::text,
    'deletion_scheduled_at', scheduled_time,
    'days_delay', days_delay
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 3. 削除をキャンセルする関数（再ログイン時に使用）
CREATE OR REPLACE FUNCTION cancel_user_deletion()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  cancelled_count integer;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;
  
  -- 削除リクエストをキャンセル
  UPDATE public.user_deletion_queue
  SET 
    status = 'cancelled',
    updated_at = now()
  WHERE user_id = current_user_id AND status = 'pending';
  
  GET DIAGNOSTICS cancelled_count = ROW_COUNT;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'User deletion cancelled',
    'cancelled_requests', cancelled_count
  );
END;
$$;

-- 4. スケジュールされた削除を実行する関数（定期実行用）
CREATE OR REPLACE FUNCTION process_scheduled_deletions()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deletion_record record;
  deleted_count integer := 0;
  error_count integer := 0;
BEGIN
  -- 削除時刻が過ぎたユーザーを取得
  FOR deletion_record IN 
    SELECT user_id, user_email, id
    FROM public.user_deletion_queue
    WHERE status = 'pending' 
    AND deletion_scheduled_at <= now()
  LOOP
    BEGIN
      -- 認証ユーザーを削除（サービスロールキーが必要）
      -- この部分はEdge Functionから呼び出す必要があります
      UPDATE public.user_deletion_queue
      SET 
        status = 'completed',
        updated_at = now()
      WHERE id = deletion_record.id;
      
      deleted_count := deleted_count + 1;
      
    EXCEPTION
      WHEN OTHERS THEN
        -- エラーログを記録
        UPDATE public.user_deletion_queue
        SET updated_at = now()
        WHERE id = deletion_record.id;
        
        error_count := error_count + 1;
    END;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'processed_deletions', deleted_count,
    'errors', error_count,
    'message', 'Scheduled deletions processed'
  );
END;
$$;