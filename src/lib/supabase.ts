
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate that required environment variables are set
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not set. Please add it to your environment variables.')
  throw new Error('Supabase URL is required. Please set VITE_SUPABASE_URL environment variable.')
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not set. Please add it to your environment variables.')
  throw new Error('Supabase anon key is required. Please set VITE_SUPABASE_ANON_KEY environment variable.')
}

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
