import { supabaseAdmin } from './supabaseAdmin'
import { categorySchema, Category } from '../types/db'

export async function listCategories(): Promise<Category[]> {
	const { data, error } = await supabaseAdmin.from('categories').select('*').order('name')
	if (error) throw error
	return (data ?? []).map((c) => categorySchema.parse(c))
}

export async function getCategory(id: string): Promise<Category | null> {
	const { data, error } = await supabaseAdmin.from('categories').select('*').eq('id', id).single()
	if (error) return null
	return categorySchema.parse(data)
}

export async function createCategory(input: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
	const { data, error } = await supabaseAdmin.from('categories').insert(input).select('*').single()
	if (error) throw error
	return categorySchema.parse(data)
}

export async function updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): Promise<Category> {
	const { data, error } = await supabaseAdmin.from('categories').update(patch).eq('id', id).select('*').single()
	if (error) throw error
	return categorySchema.parse(data)
}

export async function deleteCategory(id: string): Promise<void> {
	const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
	if (error) throw error
}


