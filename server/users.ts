import { supabaseAdmin } from './supabaseAdmin'
import { UserProfile, userProfileSchema, userRoleSchema } from '../types/db'

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
	const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', userId).single()
	if (error) return null
	return userProfileSchema.parse(data)
}

export async function updateMyProfile(userId: string, patch: Partial<Pick<UserProfile, 'name'>>) {
	const { error } = await supabaseAdmin.from('users').update(patch).eq('id', userId)
	if (error) throw error
}

export async function listUsers(): Promise<UserProfile[]> {
	const { data, error } = await supabaseAdmin.from('users').select('*').order('created_at', { ascending: false })
	if (error) throw error
	return data.map((d) => userProfileSchema.parse(d))
}

export async function setRole(userId: string, role: 'admin' | 'user') {
	userRoleSchema.parse(role)
	const { error } = await supabaseAdmin.from('users').update({ role }).eq('id', userId)
	if (error) throw error
}


