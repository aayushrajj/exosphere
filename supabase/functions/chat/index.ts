
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

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { question, sessionId } = await req.json()

    if (!question) {
      throw new Error('Question is required')
    }

    // Fetch context data from Supabase tables
    const { data: departments } = await supabase.from('departments').select('*')
    const { data: metrics } = await supabase.from('metrics').select('*')
    const { data: deliveryIssues } = await supabase.from('deliveryissues').select('*')

    // Fetch recent chat history for this session (last 10 messages)
    const { data: chatHistory } = await supabase
      .from('chatlogs')
      .select('question, ai_response, timestamp')
      .eq('user_id', user.id)
      .eq('session_id', sessionId || 'default')
      .order('timestamp', { ascending: true })
      .limit(10)

    const context = {
      departments,
      metrics,
      deliveryIssues
    }

    // Build conversation context from chat history
    const conversationHistory = chatHistory?.map(chat => ({
      user: chat.question,
      assistant: chat.ai_response
    })) || []

    // Enhanced system prompt with application context and conversational abilities
    const systemPrompt = `You are a chat assistant for Exosphere, the C-Suite Agent App. 

**PRIMARY PURPOSE**: Provide executive-level insights and answers about business operations using the provided database context, but you can also engage in normal conversation about general topics.

**ABOUT EXOSPHERE**: 
Exosphere is a comprehensive C-Suite Agent App designed to solve key executive challenges:
- Centralizes real-time business insights from all key departments (Finance, Sales, Ops, HR, Delivery)
- Automates meeting scheduling and follow-up tasks to free up executive bandwidth  
- Maintains continuous audit trails for compliance and transparency
- Provides instant insights through natural language queries
- Built with scalable architecture allowing seamless addition of new departments

**CORE BENEFITS**:
- Instant Insights: Executives can ask questions in natural language and receive up-to-date answers
- Automated Coordination: Automatically schedules meetings and drafts follow-up emails when KPIs slip
- Audit-Ready Records: Every interaction is logged for easy compliance with standards like CMMI and ISO
- Scalable Architecture: Built on modular agents for easy expansion

**CONVERSATION STYLE**: 
- For Exosphere/business questions: Use the database context provided and give concise, executive-level insights
- For general conversation: Engage naturally but always mention that your primary role is as an Exosphere assistant
- Always be helpful, professional, and executive-focused in your responses

**DATABASE CONTEXT**: ${JSON.stringify(context)}

**CONVERSATION HISTORY**: ${JSON.stringify(conversationHistory)}

Now, please answer the following question: ${question}`

    // Call Google Gemini API with updated model
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }]
      })
    })

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response'

    // Log the chat interaction with session ID
    await supabase.from('chatlogs').insert({
      user_id: user.id,
      question,
      ai_response: aiResponse,
      session_id: sessionId || 'default',
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Chat function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
