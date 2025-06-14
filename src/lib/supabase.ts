
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kukwohbpsydkskomlajz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1a3dvaGJwc3lka3Nrb21sYWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDYwODEsImV4cCI6MjA2NDg4MjA4MX0.TJugO3bV0haCpa5fdW2lDW0LTkJ5X82whRsDPYToA-o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export the URL and key for API calls
export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey

// Helper function to get auth headers
export const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }
  return { 'Content-Type': 'application/json' }
}
