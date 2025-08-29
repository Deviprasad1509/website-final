import { Book, Category } from '../types/db'

export async function getBooks(searchParams: { [key: string]: string | string[] | undefined }): Promise<Book[]> {
	try {
		const params = new URLSearchParams()
		if (searchParams.q) params.append('q', searchParams.q as string)
		if (searchParams.category) params.append('category', searchParams.category as string)
		if (searchParams.sort) params.append('sort', searchParams.sort as string)
		if (searchParams.limit) params.append('limit', searchParams.limit as string)
		
		const response = await fetch(`/api/books?${params.toString()}`, {
			next: { revalidate: 300 } // Revalidate every 5 minutes
		})
		
		if (!response.ok) {
			throw new Error('Failed to fetch books')
		}
		
		const data = await response.json()
		return data.books || []
	} catch (error) {
		console.error('Error fetching books:', error)
		return []
	}
}

export async function getCategories(): Promise<Category[]> {
	try {
		const response = await fetch(`/api/categories`, {
			next: { revalidate: 3600 } // Revalidate every hour
		})
		
		if (!response.ok) {
			throw new Error('Failed to fetch categories')
		}
		
		const data = await response.json()
		return data.categories || []
	} catch (error) {
		console.error('Error fetching categories:', error)
		return []
	}
}
