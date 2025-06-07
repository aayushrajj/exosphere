
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

    const url = new URL(req.url)
    const path = url.pathname

    if (path.includes('/draft')) {
      // Draft email using Gemini
      const { department, metric } = await req.json()

      if (!department || !metric) {
        throw new Error('Department and metric are required')
      }

      const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured')
      }

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Draft a professional email to the head of ${department} department requesting an update on the ${metric} metric. The email should be concise, executive-level, and include a clear call-to-action. Use a formal but friendly tone.`
            }]
          }]
        })
      })

      const geminiData = await geminiResponse.json()
      const draft = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate email draft'

      return new Response(
        JSON.stringify({ draft }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path.includes('/send')) {
      // Log sent email
      const { department, metric, draft } = await req.json()

      if (!department || !metric || !draft) {
        throw new Error('Department, metric, and draft are required')
      }

      const { data: sentEmail, error } = await supabase
        .from('sent_emails')
        .insert({
          department,
          metric,
          draft,
          sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, email: sentEmail }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
