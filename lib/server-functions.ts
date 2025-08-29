import { z } from 'zod'
import { supabaseClient } from './supabaseClient'
import { bookSchema, Book, paginationQuerySchema, userProfileSchema, UserProfile, categorySchema, Category, authorSchema, Author, reviewSchema, Review, orderSchema, Order, librarySchema, Library } from '../types/db'
import { createClient } from '@supabase/supabase-js'

// Admin client for server operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
}) : supabaseClient

// Books
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
		switch (sort) {
			case 'price-asc':
				query = query.order('price', { ascending: true })
				break
			case 'price-desc':
				query = query.order('price', { ascending: false })
				break
			case 'title-asc':
				query = query.order('title', { ascending: true })
				break
			case 'latest':
				query = query.order('created_at', { ascending: false })
				break
			default:
				query = query.order('created_at', { ascending: false })
		}
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

// Library
export async function hasAccess(userId: string, bookId: string): Promise<boolean> {
	const { data, error } = await supabaseAdmin.from('library').select('id').eq('user_id', userId).eq('book_id', bookId).single()
	if (error) return false
	return !!data
}

export async function listMyLibrary(userId: string): Promise<Library[]> {
	const { data, error } = await supabaseAdmin.from('library').select('*, books(*, authors(*), categories(*))').eq('user_id', userId).order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map(l => librarySchema.parse(l))
}

// Auth
export async function getSessionUser(): Promise<UserProfile | null> {
	try {
		const { data } = await supabaseAdmin.auth.getUser()
		const authUser = data.user
		if (!authUser) return null
		const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', authUser.id).single()
		if (!profile) return null
		// Combine profile with auth user data
		const userProfile = {
			...profile,
			email: authUser.email,
			name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User'
		}
		return userProfileSchema.parse(userProfile)
	} catch (error) {
		return null
	}
}

export async function requireAuth(): Promise<UserProfile> {
	const user = await getSessionUser()
	if (!user) throw new Error('Unauthorized')
	return user
}

export async function requireAdmin(): Promise<UserProfile> {
	const user = await requireAuth()
	if (user.role !== 'admin') throw new Error('Forbidden')
	return user
}

export async function signUp(email: string, password: string, name: string) {
	const { data: authData, error } = await supabaseAdmin.auth.signUp({
		email,
		password,
		options: { data: { name } }
	})
	if (error) throw error
	const authUser = authData.user
	if (!authUser) throw new Error('Signup failed')
	// Profile will be created by the trigger, but we can ensure it exists
	await supabaseAdmin.from('profiles').upsert({
		id: authUser.id,
		role: 'user'
	}, { onConflict: 'id' })
	return { userId: authUser.id }
}

export async function signIn(email: string, password: string) {
	const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
	if (error) throw error
	return { session: data.session }
}

export async function signOut() {
	await supabaseAdmin.auth.signOut()
}

// Categories
export async function listCategories() {
	const { data, error } = await supabaseAdmin.from('categories').select('*').order('name', { ascending: true })
	if (error) throw error
	return data ?? []
}

export async function createCategory(input: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
	const { data, error } = await supabaseAdmin.from('categories').insert(input).select('*').single()
	if (error) throw error
	return categorySchema.parse(data)
}

export async function getCategory(id: string): Promise<Category | null> {
	const { data, error } = await supabaseAdmin.from('categories').select('*').eq('id', id).single()
	if (error) return null
	return categorySchema.parse(data)
}

export async function updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): Promise<Category> {
	const { data, error } = await supabaseAdmin.from('categories').update(patch).eq('id', id).select('*').single()
	if (error) throw error
	return categorySchema.parse(data)
}

export async function deleteCategory(id: string) {
	const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
	if (error) throw error
}

// Authors
export async function listAuthors() {
	const { data, error } = await supabaseAdmin.from('authors').select('*').order('name', { ascending: true })
	if (error) throw error
	return data ?? []
}

export async function createAuthor(input: Omit<Author, 'id' | 'created_at'>): Promise<Author> {
	const { data, error } = await supabaseAdmin.from('authors').insert(input).select('*').single()
	if (error) throw error
	return authorSchema.parse(data)
}

export async function getAuthor(id: string): Promise<Author | null> {
	const { data, error } = await supabaseAdmin.from('authors').select('*').eq('id', id).single()
	if (error) return null
	return authorSchema.parse(data)
}

export async function updateAuthor(id: string, patch: Partial<Omit<Author, 'id'>>): Promise<Author> {
	const { data, error } = await supabaseAdmin.from('authors').update(patch).eq('id', id).select('*').single()
	if (error) throw error
	return authorSchema.parse(data)
}

export async function deleteAuthor(id: string) {
	const { error } = await supabaseAdmin.from('authors').delete().eq('id', id)
	if (error) throw error
}

// Reviews
export async function listReviewsByBook(bookId: string): Promise<Review[]> {
	const { data, error } = await supabaseAdmin.from('reviews').select('*').eq('book_id', bookId).order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map(r => reviewSchema.parse(r))
}

export async function upsertReview(input: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
	const { data, error } = await supabaseAdmin.from('reviews').upsert(input).select('*').single()
	if (error) throw error
	return reviewSchema.parse(data)
}
