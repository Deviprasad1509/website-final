import { supabaseAdmin } from './supabaseAdmin'
import { librarySchema, Library } from '../types/db'

export async function listMyLibrary(userId: string): Promise<Library[]> {
	const { data, error } = await supabaseAdmin.from('library').select('*, books(*, authors(*), categories(*))').eq('user_id', userId).order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map(l => librarySchema.parse(l))
}

export async function hasAccess(userId: string, bookId: string): Promise<boolean> {
	const { data, error } = await supabaseAdmin.from('library').select('id').eq('user_id', userId).eq('book_id', bookId).single()
	if (error) return false
	return !!data
}

export async function addToLibrary(userId: string, bookId: string): Promise<Library> {
	const { data, error } = await supabaseAdmin.from('library').insert({ user_id: userId, book_id: bookId }).select('*').single()
	if (error) throw error
	return librarySchema.parse(data)
}

export async function removeFromLibrary(userId: string, bookId: string): Promise<void> {
	const { error } = await supabaseAdmin.from('library').delete().eq('user_id', userId).eq('book_id', bookId)
	if (error) throw error
}
