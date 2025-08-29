import { Book } from '../types/db'
import BookCard from './book-card'

async function getFeaturedBooks(): Promise<Book[]> {
	try {
		const response = await fetch(`/api/books?limit=6&sort=-created_at`, {
			next: { revalidate: 3600 } // Revalidate every hour
		})
		
		if (!response.ok) {
			console.error('Failed to fetch featured books:', response.statusText)
			return []
		}
		
		const data = await response.json()
		return data.books || []
	} catch (error) {
		console.error('Error fetching featured books:', error)
		return []
	}
}

export default async function FeaturedBooks() {
	const books = await getFeaturedBooks()
	
	if (books.length === 0) {
		return (
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">Featured Books</h2>
					<div className="text-center text-gray-500">
						No books available at the moment.
					</div>
				</div>
			</section>
		)
	}
	
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">Featured Books</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{books.map((book) => (
						<BookCard key={book.id} book={book} />
					))}
				</div>
			</div>
		</section>
	)
}
