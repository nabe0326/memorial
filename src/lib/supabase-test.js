// Supabase接続テスト用ファイル
// 開発環境での接続確認に使用

import { supabase } from './supabase.js'

// 基本的な接続テスト
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Supabase接続テストを開始...')
    
    // 1. 基本的な接続テスト
    const { data, error } = await supabase
      .from('persons')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase接続エラー:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase接続成功!')
    console.log(`📊 persons テーブル件数: ${data || 0}`)
    
    // 2. 認証状態の確認
    const { data: { user } } = await supabase.auth.getUser()
    console.log(`👤 認証状態: ${user ? `ログイン中 (${user.email})` : '未ログイン'}`)
    
    return { success: true, user }
    
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

// テーブル存在確認
export async function checkTablesExist() {
  try {
    console.log('🔍 テーブル存在確認を開始...')
    
    // persons テーブルの確認
    const { error: personsError } = await supabase
      .from('persons')
      .select('id', { head: true, count: 'exact' })
    
    // events テーブルの確認
    const { error: eventsError } = await supabase
      .from('events')
      .select('id', { head: true, count: 'exact' })
    
    const results = {
      persons: !personsError,
      events: !eventsError
    }
    
    console.log('📋 テーブル存在確認結果:')
    console.log(`  - persons: ${results.persons ? '✅' : '❌'}`)
    console.log(`  - events: ${results.events ? '✅' : '❌'}`)
    
    if (personsError) console.log(`    persons エラー: ${personsError.message}`)
    if (eventsError) console.log(`    events エラー: ${eventsError.message}`)
    
    return results
    
  } catch (error) {
    console.error('❌ テーブル確認エラー:', error)
    return { persons: false, events: false }
  }
}

// RLS ポリシーのテスト（認証が必要）
export async function testRLSPolicies() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('⚠️ RLS テストには認証が必要です')
      return { success: false, message: 'Authentication required' }
    }
    
    console.log('🔐 RLS ポリシーテストを開始...')
    
    // persons テーブルへの読み取りテスト
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log(`❌ RLS エラー: ${error.message}`)
      return { success: false, error: error.message }
    }
    
    console.log('✅ RLS ポリシー正常動作')
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ RLS テストエラー:', error)
    return { success: false, error: error.message }
  }
}