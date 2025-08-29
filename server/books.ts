import { z } from 'zod'
import { supabaseAdmin } from './supabaseAdmin'
import { bookSchema, Book, paginationQuerySchema } from '../types/db'

export async function listBooks(params: Partial<z.infer<typeof paginationQuerySchema>> = {}) {
	const { q, category, sort, limit = 20, cursor } = paginationQuerySchema.partial().parse(params)
	let query = supabaseAdmin.from('books').select('*, authors(*), categories(*)')
	if (q) {
		query = query.ilike('title', `%${q}%`)
	}
	if (category) {
		query = query.eq('category_id', category)
	}
	if (cursor) {
		query = query.gt('id', cursor)
	}
	if (sort) {
		const ascending = !sort.startsWith('-')
		const col = ascending ? sort : sort.slice(1)
		// @ts-ignore supabase-js typing for order
		query = query.order(col, { ascending })
	} else {
		// @ts-ignore
		query = query.order('created_at', { ascending: false })
	}
	const { data, error } = await query.limit(limit)
	if (error) throw error
	return (data ?? []).map((b) => bookSchema.parse(b))
}

export async function getBook(id: string): Promise<Book | null> {
	const { data, error } = await supabaseAdmin.from('books').select('*, authors(*), categories(*)').eq('id', id).single()
	if (error) return null
	return bookSchema.parse(data)
}

export async function createBook(input: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
	const { data, error } = await supabaseAdmin.from('books').insert(input).select('*').single()
	if (error) throw error
	return bookSchema.parse(data)
}

export async function updateBook(id: string, patch: Partial<Omit<Book, 'id'>>): Promise<Book> {
	const { data, error } = await supabaseAdmin.from('books').update(patch).eq('id', id).select('*').single()
	if (error) throw error
	return bookSchema.parse(data)
}

export async function deleteBook(id: string) {
	const { error } = await supabaseAdmin.from('books').delete().eq('id', id)
	if (error) throw error
}

export async function uploadCover(file: File, fileName: string): Promise<string> {
	const { data, error } = await supabaseAdmin.storage.from('covers').upload(fileName, file, { upsert: true })
	if (error) throw error
	return data.path
}

export async function uploadBookFile(file: File, fileName: string): Promise<string> {
	const { data, error } = await supabaseAdmin.storage.from('books').upload(fileName, file, { upsert: true })
	if (error) throw error
	return data.path
}

export async function getSignedBookUrl(path: string, expiresInSeconds = 60 * 10) {
	const { data, error } = await supabaseAdmin.storage.from('books').createSignedUrl(path, expiresInSeconds)
	if (error) throw error
	return data.signedUrl
}


