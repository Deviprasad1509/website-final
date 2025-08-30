import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

// During build time, provide fallback values to prevent build errors
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackServiceKey = 'placeholder-service-key'

// Use fallback values during build if environment variables are not available
const finalUrl = supabaseUrl || fallbackUrl
const finalServiceKey = serviceRoleKey || fallbackServiceKey

export const supabaseAdmin = createClient(finalUrl, finalServiceKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
})

// Export a flag to check if we have valid credentials
export const hasValidSupabaseAdminCredentials = !!(supabaseUrl && serviceRoleKey &&
	!supabaseUrl.includes('your-supabase-url') && !serviceRoleKey.includes('your-supabase'))

export type SupabaseAdmin = typeof supabaseAdmin


