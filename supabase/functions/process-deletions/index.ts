import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    // Create Supabase client with service role key (admin privileges)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get scheduled deletions
    const { data: deletions, error: queryError } = await supabaseAdmin
      .from('user_deletion_queue')
      .select('id, user_id, user_email, deletion_scheduled_at')
      .eq('status', 'pending')
      .lte('deletion_scheduled_at', new Date().toISOString())

    if (queryError) {
      console.error('Error querying deletions:', queryError)
      return new Response(
        JSON.stringify({ error: queryError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let processedCount = 0
    let errorCount = 0

    for (const deletion of deletions || []) {
      try {
        console.log(`Processing deletion for user: ${deletion.user_id} (${deletion.user_email})`)

        // Delete the user from auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(deletion.user_id)

        if (deleteError) {
          console.error(`Error deleting user ${deletion.user_id}:`, deleteError)
          errorCount++
          continue
        }

        // Mark as completed
        const { error: updateError } = await supabaseAdmin
          .from('user_deletion_queue')
          .update({ 
            status: 'completed', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', deletion.id)

        if (updateError) {
          console.error(`Error updating deletion record ${deletion.id}:`, updateError)
        }

        processedCount++
        console.log(`Successfully deleted user: ${deletion.user_id}`)

      } catch (error) {
        console.error(`Error processing deletion for user ${deletion.user_id}:`, error)
        errorCount++
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: processedCount,
        errors: errorCount,
        total_checked: deletions?.length || 0,
        message: `Processed ${processedCount} deletions with ${errorCount} errors`
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )

  } catch (error) {
    console.error('Error in process-deletions function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})