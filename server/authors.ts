import { supabaseAdmin } from './supabaseAdmin'
import { authorSchema, Author } from '../types/db'

export async function listAuthors(): Promise<Author[]> {
	const { data, error } = await supabaseAdmin.from('authors').select('*').order('name')
	if (error) throw error
	return (data ?? []).map((a) => authorSchema.parse(a))
}

export async function getAuthor(id: string): Promise<Author | null> {
	const { data, error } = await supabaseAdmin.from('authors').select('*').eq('id', id).single()
	if (error) return null
	return authorSchema.parse(data)
}

export async function createAuthor(input: Omit<Author, 'id' | 'created_at'>): Promise<Author> {
	const { data, error } = await supabaseAdmin.from('authors').insert(input).select('*').single()
	if (error) throw error
	return authorSchema.parse(data)
}

export async function updateAuthor(id: string, patch: Partial<Omit<Author, 'id'>>): Promise<Author> {
	const { data, error } = await supabaseAdmin.from('authors').update(patch).eq('id', id).select('*').single()
	if (error) throw error
	return authorSchema.parse(data)
}

export async function deleteAuthor(id: string): Promise<void> {
	const { error } = await supabaseAdmin.from('authors').delete().eq('id', id)
	if (error) throw error
}


