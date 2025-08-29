import { supabaseAdmin } from './supabaseAdmin'
import { reviewSchema, Review } from '../types/db'

export async function listReviewsByBook(bookId: string): Promise<Review[]> {
	const { data, error } = await supabaseAdmin.from('reviews').select('*, users(name)').eq('book_id', bookId).order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map((r) => reviewSchema.parse(r))
}

export async function upsertReview(userId: string, bookId: string, rating: number, comment: string = ''): Promise<Review> {
	const { data, error } = await supabaseAdmin.from('reviews').upsert({ user_id: userId, book_id: bookId, rating, comment }, { onConflict: 'user_id,book_id' }).select('*').single()
	if (error) throw error
	return reviewSchema.parse(data)
}

export async function deleteReview(userId: string, bookId: string): Promise<void> {
	const { error } = await supabaseAdmin.from('reviews').delete().eq('user_id', userId).eq('book_id', bookId)
	if (error) throw error
}
