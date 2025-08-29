import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
}

if (supabaseUrl.includes('your-supabase-url') || supabaseAnonKey.includes('your-supabase')) {
	throw new Error('Invalid Supabase credentials. Please update your .env.local file with valid Supabase project credentials.')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
})

export type SupabaseBrowser = typeof supabaseClient


