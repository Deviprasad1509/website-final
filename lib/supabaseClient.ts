import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// During build time, provide fallback values to prevent build errors
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-key'

// Use fallback values during build if environment variables are not available
const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseAnonKey || fallbackKey

export const supabaseClient = createClient(finalUrl, finalKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
})

// Export a flag to check if we have valid credentials
export const hasValidSupabaseCredentials = !!(supabaseUrl && supabaseAnonKey &&
	!supabaseUrl.includes('your-supabase-url') && !supabaseAnonKey.includes('your-supabase'))

export type SupabaseBrowser = typeof supabaseClient


