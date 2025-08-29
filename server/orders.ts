import { supabaseAdmin } from './supabaseAdmin'
import { orderSchema, orderItemSchema, Order, OrderItem } from '../types/db'

export async function createOrder(userId: string, items: Array<{ book_id: string; qty: number }>): Promise<Order> {
	// Get book prices and calculate totals
	const bookIds = items.map(item => item.book_id)
	const { data: books, error: booksError } = await supabaseAdmin.from('books').select('id, price').in('id', bookIds)
	if (booksError) throw booksError
	
	const bookPrices = new Map(books.map(b => [b.id, b.price]))
	let subtotal = 0
	const orderItems: Omit<OrderItem, 'id' | 'order_id'>[] = []
	
	for (const item of items) {
		const price = bookPrices.get(item.book_id)
		if (!price) throw new Error(`Book ${item.book_id} not found`)
		const unitPrice = price
		subtotal += unitPrice * item.qty
		orderItems.push({ book_id: item.book_id, qty: item.qty, unit_price: unitPrice })
	}
	
	const total = subtotal // Add tax/shipping logic here if needed
	
	// Create order
	const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
		user_id: userId,
		subtotal,
		total,
		status: 'pending'
	}).select('*').single()
	
	if (orderError) throw orderError
	
	// Create order items
	const orderItemsWithOrderId = orderItems.map(item => ({ ...item, order_id: order.id }))
	const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsWithOrderId)
	if (itemsError) throw itemsError
	
	return orderSchema.parse({ ...order, items: orderItemsWithOrderId })
}

export async function listMyOrders(userId: string): Promise<Order[]> {
	const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*, books(*))').eq('user_id', userId).order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map(o => orderSchema.parse(o))
}

export async function getOrderDetail(orderId: string, userId: string): Promise<Order | null> {
	const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*, books(*))').eq('id', orderId).eq('user_id', userId).single()
	if (error) return null
	return orderSchema.parse(data)
}

export async function listAllOrders(): Promise<Order[]> {
	const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*, books(*)), users(name, email)').order('created_at', { ascending: false })
	if (error) throw error
	return (data ?? []).map(o => orderSchema.parse(o))
}

export async function setOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
	const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', orderId)
	if (error) throw error
}

export async function markOrderCompleted(orderId: string): Promise<void> {
	// Mark order as completed and add books to user's library
	const { data: order, error: orderError } = await supabaseAdmin.from('orders').select('*, order_items(book_id)').eq('id', orderId).single()
	if (orderError) throw orderError
	
	// Update order status
	await setOrderStatus(orderId, 'completed')
	
	// Add books to library
	const libraryEntries = order.order_items.map((item: any) => ({
		user_id: order.user_id,
		book_id: item.book_id
	}))
	
	const { error: libraryError } = await supabaseAdmin.from('library').upsert(libraryEntries, { onConflict: 'user_id,book_id' })
	if (libraryError) throw libraryError
}
