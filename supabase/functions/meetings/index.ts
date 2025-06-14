
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    if (req.method === 'GET') {
      // Get all calendar events - using correct table name
      const { data: meetings, error } = await supabase
        .from('calendarevents')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) throw error

      return new Response(
        JSON.stringify(meetings),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Create new meeting - using correct table name
      const { title, start_time, end_time, attendees } = await req.json()

      if (!title || !start_time || !end_time) {
        throw new Error('Title, start_time, and end_time are required')
      }

      const { data: meeting, error } = await supabase
        .from('calendarevents')
        .insert({
          title,
          start_time,
          end_time,
          attendees: attendees || []
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(meeting),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Meetings function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
