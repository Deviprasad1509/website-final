import { supabaseClient } from './supabaseClient'
import { Book, Category, Author } from '../types/db'

class DatabaseService {
  // Books
  async getBooks(filters?: { category?: string; featured?: boolean; limit?: number }) {
    try {
      let query = supabaseClient.from('books').select('*, authors(*), categories(*)')
      if (filters?.category) query = query.eq('category_id', filters.category)
      if (filters?.featured !== undefined) query = query.eq('is_featured', filters.featured)
      query = query.order('created_at', { ascending: false })
      if (filters?.limit) query = query.limit(filters.limit)
      const { data, error } = await query
      return { data, error }
    } catch (error) {
      console.error('Error fetching books:', error)
      return { data: null, error }
    }
  }

  async getBookById(id: string) {
    try {
      const { data, error } = await supabaseClient.from('books').select('*, authors(*), categories(*)').eq('id', id).single()
      if (error) return { data: null, error }
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching book:', error)
      return { data: null, error }
    }
  }

  async createBook(book: Omit<Book, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabaseClient.from('books').insert([book]).single()
      return { data, error }
    } catch (error) {
      console.error('Error creating book:', error)
      return { data: null, error }
    }
  }

  async updateBook(id: string, updates: Partial<Book>) {
    try {
      const { data, error } = await supabaseClient.from('books').update(updates).eq('id', id).single()
      return { data, error }
    } catch (error) {
      console.error('Error updating book:', error)
      return { data: null, error }
    }
  }

  async deleteBook(id: string) {
    try {
      const { error } = await supabaseClient.from('books').delete().eq('id', id)
      return { success: !error, error }
    } catch (error) {
      console.error('Error deleting book:', error)
      return { success: false, error }
    }
  }

  // Categories
  async getCategories() {
    try {
      const { data, error } = await supabaseClient.from('categories').select('*').order('name', { ascending: true })
      return { data, error }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error }
    }
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabaseClient.from('categories').insert([category]).single()
      return { data, error }
    } catch (error) {
      console.error('Error creating category:', error)
      return { data: null, error }
    }
  }

  // Authors
  async getAuthors() {
    try {
      const { data, error } = await supabaseClient.from('authors').select('*').order('name', { ascending: true })
      return { data, error }
    } catch (error) {
      console.error('Error fetching authors:', error)
      return { data: null, error }
    }
  }

  async createAuthor(author: Omit<Author, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabaseClient.from('authors').insert([author]).single()
      return { data, error }
    } catch (error) {
      console.error('Error creating author:', error)
      return { data: null, error }
    }
  }

  // User Profile
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabaseClient.from('users').select('*').eq('id', userId).single()
      if (error) return { data: null, error }
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  }

  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabaseClient.from('users').update(updates).eq('id', userId).single()
      return { data, error }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  // Orders
  async createOrder(orderData: {
    userId: string
    totalAmount: number
    items: Array<{ bookId: string; price: number }>
  }) {
    try {
      const { data, error } = await supabaseClient.from('orders').insert([{
        user_id: orderData.userId,
        total: orderData.totalAmount,
        status: 'pending'
      }]).single()
      return { data, error }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  }

  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabaseClient.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }
  }

  // Library
  async getUserLibrary(userId: string) {
    try {
      const { data, error } = await supabaseClient.from('library').select('*, books(*)').eq('user_id', userId).order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Error fetching user library:', error)
      return { data: null, error }
    }
  }

  async addToLibrary(userId: string, bookId: string) {
    try {
      const { data, error } = await supabaseClient.from('library').insert([{
        user_id: userId,
        book_id: bookId
      }]).single()
      return { data, error }
    } catch (error) {
      console.error('Error adding to library:', error)
      return { data: null, error }
    }
  }
}

export const db = new DatabaseService()
