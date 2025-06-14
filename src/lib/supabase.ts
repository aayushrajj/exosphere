
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export the URL and key for API calls
export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const session = localStorage.getItem('supabase.session')
  if (session) {
    const { access_token } = JSON.parse(session)
    return {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  }
  return { 'Content-Type': 'application/json' }
}
