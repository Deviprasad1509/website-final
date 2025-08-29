"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { 
	BookOpen, 
	Users, 
	ShoppingCart, 
	BarChart3, 
	Plus,
	Edit,
	Trash2,
	Eye
} from 'lucide-react'
import { Book, Author, Category, Order } from '../types/db'

interface AdminDashboardProps {
	userId: string
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
	const [activeTab, setActiveTab] = useState('overview')
	const [books, setBooks] = useState<Book[]>([])
	const [authors, setAuthors] = useState<Author[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchDashboardData()
	}, [])

	const fetchDashboardData = async () => {
		setLoading(true)
		try {
			// Fetch all data in parallel
			const [booksRes, authorsRes, categoriesRes, ordersRes] = await Promise.all([
				fetch('/api/books?limit=100'),
				fetch('/api/authors'),
				fetch('/api/categories'),
				fetch('/api/orders?admin=true')
			])

			const [booksData, authorsData, categoriesData, ordersData] = await Promise.all([
				booksRes.json(),
				authorsRes.json(),
				categoriesRes.json(),
				ordersRes.json()
			])

			if (booksData.ok) setBooks(booksData.books || [])
			if (authorsData.ok) setAuthors(authorsData.authors || [])
			if (categoriesData.ok) setCategories(categoriesData.categories || [])
			if (ordersData.ok) setOrders(ordersData.orders || [])

		} catch (err) {
			setError('Failed to fetch dashboard data')
		} finally {
			setLoading(false)
		}
	}

	const getStats = () => {
		const totalRevenue = orders
			.filter(order => order.status === 'completed')
			.reduce((sum, order) => sum + (order.total || 0), 0)

		const pendingOrders = orders.filter(order => order.status === 'pending').length
		const completedOrders = orders.filter(order => order.status === 'completed').length

		return {
			totalBooks: books.length,
			totalAuthors: authors.length,
			totalCategories: categories.length,
			totalOrders: orders.length,
			pendingOrders,
			completedOrders,
			totalRevenue
		}
	}

	const handleDeleteBook = async (bookId: string) => {
		if (!confirm('Are you sure you want to delete this book?')) return

		try {
			const response = await fetch(`/api/books/${bookId}`, {
				method: 'DELETE'
			})

			if (response.ok) {
				setBooks(books.filter(book => book.id !== bookId))
			} else {
				setError('Failed to delete book')
			}
		} catch (err) {
			setError('Failed to delete book')
		}
	}

	const handleDeleteAuthor = async (authorId: string) => {
		if (!confirm('Are you sure you want to delete this author?')) return

		try {
			const response = await fetch(`/api/authors/${authorId}`, {
				method: 'DELETE'
			})

			if (response.ok) {
				setAuthors(authors.filter(author => author.id !== authorId))
			} else {
				setError('Failed to delete author')
			}
		} catch (err) {
			setError('Failed to delete author')
		}
	}

	const handleDeleteCategory = async (categoryId: string) => {
		if (!confirm('Are you sure you want to delete this category?')) return

		try {
			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'DELETE'
			})

			if (response.ok) {
				setCategories(categories.filter(category => category.id !== categoryId))
			} else {
				setError('Failed to delete category')
			}
		} catch (err) {
			setError('Failed to delete category')
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
					<p className="text-gray-500">Loading dashboard...</p>
				</div>
			</div>
		)
	}

	const stats = getStats()

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-gray-600">Manage your bookstore</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Books</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalBooks}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOrders}</div>
						<p className="text-xs text-muted-foreground">
							{stats.pendingOrders} pending
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Authors</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalAuthors}</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="books">Books</TabsTrigger>
					<TabsTrigger value="authors">Authors</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{orders.slice(0, 5).map((order) => (
										<div key={order.id} className="flex justify-between items-center py-2 border-b">
											<div>
												<p className="font-medium">Order #{order.id?.slice(0, 8)}</p>
												<p className="text-sm text-gray-500">
													{new Date(order.created_at).toLocaleDateString()}
												</p>
											</div>
											<div className="text-right">
												<p className="font-medium">${order.total?.toFixed(2)}</p>
												<Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
													{order.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full justify-start" variant="outline">
									<Plus className="mr-2 h-4 w-4" />
									Add New Book
								</Button>
								<Button className="w-full justify-start" variant="outline">
									<Plus className="mr-2 h-4 w-4" />
									Add New Author
								</Button>
								<Button className="w-full justify-start" variant="outline">
									<Plus className="mr-2 h-4 w-4" />
									Add New Category
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="books" className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Manage Books</h3>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Book
						</Button>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{books.map((book) => (
							<Card key={book.id} className="group">
								<CardHeader className="pb-3">
									<div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
										{book.cover_url ? (
											<img
												src={book.cover_url}
												alt={book.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<BookOpen className="h-8 w-8 text-gray-400" />
											</div>
										)}
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<h4 className="font-semibold line-clamp-2">{book.title}</h4>
									<p className="text-sm text-gray-600">
										by {book.authors?.name || 'Unknown'}
									</p>
									<p className="text-sm text-gray-600">
										${book.price?.toFixed(2)} • {book.stock} in stock
									</p>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" className="flex-1">
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
										<Button 
											variant="outline" 
											size="sm" 
											className="flex-1"
											onClick={() => handleDeleteBook(book.id!)}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="authors" className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Manage Authors</h3>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Author
						</Button>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{authors.map((author) => (
							<Card key={author.id}>
								<CardContent className="p-6">
									<h4 className="font-semibold text-lg mb-2">{author.name}</h4>
									<p className="text-sm text-gray-600 mb-4 line-clamp-3">
										{author.bio || 'No biography available'}
									</p>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" className="flex-1">
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
										<Button 
											variant="outline" 
											size="sm" 
											className="flex-1"
											onClick={() => handleDeleteAuthor(author.id!)}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="categories" className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Manage Categories</h3>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Category
						</Button>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{categories.map((category) => (
							<Card key={category.id}>
								<CardContent className="p-6">
									<h4 className="font-semibold text-lg mb-2">{category.name}</h4>
									<p className="text-sm text-gray-600 mb-4 line-clamp-3">
										{category.description || 'No description available'}
									</p>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" className="flex-1">
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
										<Button 
											variant="outline" 
											size="sm" 
											className="flex-1"
											onClick={() => handleDeleteCategory(category.id!)}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="orders" className="space-y-6">
					<h3 className="text-lg font-semibold">Order Management</h3>
					
					<div className="space-y-4">
						{orders.map((order) => (
							<Card key={order.id}>
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div>
											<h4 className="font-semibold">Order #{order.id?.slice(0, 8)}</h4>
											<p className="text-sm text-gray-500">
												{new Date(order.created_at).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="font-semibold text-lg">${order.total?.toFixed(2)}</p>
											<Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
												{order.status}
											</Badge>
										</div>
									</div>
									
									<div className="space-y-2">
										{order.items?.map((item) => (
											<div key={item.id} className="flex justify-between text-sm">
												<span>{item.books?.title || 'Unknown Book'} (x{item.qty})</span>
												<span>${((item.unit_price || 0) * item.qty).toFixed(2)}</span>
											</div>
										))}
									</div>
									
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm">
											<Eye className="h-4 w-4 mr-2" />
											View Details
										</Button>
										<Button variant="outline" size="sm">
											<Edit className="h-4 w-4 mr-2" />
											Update Status
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
