import { z } from 'zod'

export const userRoleSchema = z.enum(['user', 'admin'])

export const userProfileSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(1),
	role: userRoleSchema.default('user'),
	created_at: z.string().datetime().optional(),
})

export type UserRole = z.infer<typeof userRoleSchema>
export type UserProfile = z.infer<typeof userProfileSchema>

export const authorSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1),
	bio: z.string().optional().default(''),
	created_at: z.string().datetime().optional(),
})
export type Author = z.infer<typeof authorSchema>

export const categorySchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1),
	slug: z.string().min(1),
	created_at: z.string().datetime().optional(),
})
export type Category = z.infer<typeof categorySchema>

export const bookSchema = z.object({
	id: z.string().uuid().optional(),
	title: z.string().min(1),
	description: z.string().default(''),
	price: z.number().nonnegative(),
	stock: z.number().int().nonnegative().default(0),
	author_id: z.string().uuid(),
	category_id: z.string().uuid(),
	cover_url: z.string().url().optional(),
	file_url: z.string().url().optional(),
	created_at: z.string().datetime().optional(),
})
export type Book = z.infer<typeof bookSchema>

export const reviewSchema = z.object({
	id: z.string().uuid().optional(),
	book_id: z.string().uuid(),
	user_id: z.string().uuid().optional(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().default(''),
	created_at: z.string().datetime().optional(),
})
export type Review = z.infer<typeof reviewSchema>

export const orderItemSchema = z.object({
	id: z.string().uuid().optional(),
	order_id: z.string().uuid().optional(),
	book_id: z.string().uuid(),
	qty: z.number().int().min(1),
	unit_price: z.number().nonnegative(),
})
export type OrderItem = z.infer<typeof orderItemSchema>

export const orderSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
	subtotal: z.number().nonnegative().default(0),
	total: z.number().nonnegative().default(0),
	currency: z.string().default('usd'),
	created_at: z.string().datetime().optional(),
	items: z.array(orderItemSchema).optional(),
})
export type Order = z.infer<typeof orderSchema>

export const librarySchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	book_id: z.string().uuid(),
	created_at: z.string().datetime().optional(),
})
export type Library = z.infer<typeof librarySchema>

export const paginationQuerySchema = z.object({
	q: z.string().optional(),
	category: z.string().uuid().optional(),
	sort: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: z.string().optional(),
})


