import { cookies, headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from './supabaseAdmin'
import { userProfileSchema, userRoleSchema, UserProfile } from '../types/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

function getServerSupabase() {
	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
		cookies: {
			get: (key: string) => cookies().get(key)?.value,
			set: () => {},
			remove: () => {},
		},
		headers: {
			get: (key: string) => headers().get(key) ?? undefined,
		},
	})
}

export async function signup(email: string, password: string, name: string) {
	const supabase = getServerSupabase()
	const { data: authData, error } = await supabase.auth.signUp({ email, password })
	if (error) throw error
	const authUser = authData.user
	if (!authUser) throw new Error('Signup failed')
	await supabaseAdmin.from('users').upsert({ id: authUser.id, email, name, role: 'user' })
	return { userId: authUser.id }
}

export async function signIn(email: string, password: string) {
	const supabase = getServerSupabase()
	const { data, error } = await supabase.auth.signInWithPassword({ email, password })
	if (error) throw error
	return { session: data.session }
}

export async function signOut() {
	const supabase = getServerSupabase()
	await supabase.auth.signOut()
}

export async function getSessionUser() {
	const supabase = getServerSupabase()
	const { data } = await supabase.auth.getUser()
	const authUser = data.user
	if (!authUser) return null
	const { data: profile } = await supabaseAdmin.from('users').select('*').eq('id', authUser.id).single()
	if (!profile) return null
	return userProfileSchema.parse(profile)
}

export async function requireAuth() {
	const user = await getSessionUser()
	if (!user) throw new Error('Unauthorized')
	return user
}

export async function requireAdmin() {
	const user = await requireAuth()
	if (user.role !== 'admin') throw new Error('Forbidden')
	return user
}


