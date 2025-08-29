"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, BookOpen, Download, Eye } from 'lucide-react'
import { Library, Book } from '../types/db'

interface UserLibraryProps {
	userId: string
}

export default function UserLibrary({ userId }: UserLibraryProps) {
	const [library, setLibrary] = useState<Library[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredLibrary, setFilteredLibrary] = useState<Library[]>([])

	useEffect(() => {
		fetchLibrary()
	}, [userId])

	useEffect(() => {
		// Filter library based on search term
		if (searchTerm.trim() === '') {
			setFilteredLibrary(library)
		} else {
			const filtered = library.filter(item => 
				item.books?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.books?.authors?.name?.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredLibrary(filtered)
		}
	}, [searchTerm, library])

	const fetchLibrary = async () => {
		try {
			const response = await fetch('/api/library')
			const data = await response.json()

			if (data.ok) {
				setLibrary(data.library || [])
			} else {
				setError(data.error || 'Failed to fetch library')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleReadBook = (bookId: string) => {
		// TODO: Implement book reader/viewer
		console.log('Reading book:', bookId)
		// This should open the book reader component
	}

	const handleDownloadBook = async (bookId: string) => {
		try {
			// Get signed download URL
			const response = await fetch(`/api/books/${bookId}/download`)
			const data = await response.json()

			if (data.ok && data.downloadUrl) {
				// Create temporary link and trigger download
				const link = document.createElement('a')
				link.href = data.downloadUrl
				link.download = data.filename || 'book.pdf'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			} else {
				setError('Download failed')
			}
		} catch (err) {
			setError('Download failed. Please try again.')
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
					<p className="text-gray-500">Loading your library...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<div className="text-red-500 mb-4">{error}</div>
				<Button onClick={fetchLibrary}>Try Again</Button>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold">My Library</h1>
					<p className="text-gray-600">
						{library.length} book{library.length !== 1 ? 's' : ''} in your collection
					</p>
				</div>
				
				{/* Search */}
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search your books..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Library Grid */}
			{filteredLibrary.length === 0 ? (
				<div className="text-center py-12">
					<BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						{searchTerm ? 'No books found' : 'Your library is empty'}
					</h3>
					<p className="text-gray-500 mb-4">
						{searchTerm 
							? 'Try adjusting your search terms'
							: 'Start building your collection by purchasing some books'
						}
					</p>
					{!searchTerm && (
						<Button onClick={() => window.location.href = '/books'}>
							Browse Books
						</Button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLibrary.map((item) => {
						const book = item.books
						if (!book) return null

						return (
							<Card key={item.id} className="group hover:shadow-lg transition-shadow">
								<CardHeader className="pb-3">
									<div className="relative">
										<div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
											{book.cover_url ? (
												<img
													src={book.cover_url}
													alt={book.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<BookOpen className="h-12 w-12 text-gray-400" />
												</div>
											)}
										</div>
										<Badge className="absolute top-2 right-2">
											{book.categories?.name || 'Uncategorized'}
										</Badge>
									</div>
								</CardHeader>
								
								<CardContent className="space-y-3">
									<div>
										<h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
											{book.title}
										</h3>
										<p className="text-sm text-gray-600">
											by {book.authors?.name || 'Unknown Author'}
										</p>
									</div>
									
									<p className="text-sm text-gray-600 line-clamp-3">
										{book.description || 'No description available'}
									</p>
									
									<div className="flex gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleReadBook(book.id!)}
											className="flex-1"
										>
											<Eye className="h-4 w-4 mr-2" />
											Read
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDownloadBook(book.id!)}
											className="flex-1"
										>
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>
									
									<div className="text-xs text-gray-500 pt-2 border-t">
										Added to library on {new Date(item.created_at).toLocaleDateString()}
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
