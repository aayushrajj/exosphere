
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

    // Fetch audit data from multiple tables - using correct table names
    const { data: chatLogs } = await supabase
      .from('chatlogs')
      .select('question, ai_response, timestamp')
      .order('timestamp', { ascending: false })

    const { data: meetings } = await supabase
      .from('calendarevents')
      .select('title, start_time, end_time, attendees')
      .order('start_time', { ascending: false })

    const { data: emails } = await supabase
      .from('sentemails')
      .select('department, metric, draft, sent_at')
      .order('sent_at', { ascending: false })

    // Combine and format audit entries
    const auditEntries = []

    // Add chat entries
    if (chatLogs) {
      chatLogs.forEach(log => {
        auditEntries.push({
          type: 'chat',
          timestamp: log.timestamp,
          details: {
            question: log.question,
            response_snippet: log.ai_response.substring(0, 100) + '...'
          }
        })
      })
    }

    // Add meeting entries
    if (meetings) {
      meetings.forEach(meeting => {
        auditEntries.push({
          type: 'meeting',
          timestamp: meeting.start_time,
          details: {
            title: meeting.title,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            attendees: meeting.attendees
          }
        })
      })
    }

    // Add email entries
    if (emails) {
      emails.forEach(email => {
        auditEntries.push({
          type: 'email',
          timestamp: email.sent_at,
          details: {
            department: email.department,
            metric: email.metric,
            draft_snippet: email.draft.substring(0, 100) + '...'
          }
        })
      })
    }

    // Sort by timestamp (most recent first)
    auditEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return new Response(
      JSON.stringify(auditEntries),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Audit function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
