import BookCard from './book-card'
import { Book } from '../types/db'

interface BookGridProps {
	books: Book[]
}

export default function BookGrid({ books }: BookGridProps) {
	if (books.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-gray-500 text-lg mb-4">No books available</p>
				<p className="text-gray-400">Check back later for new releases</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{books.map((book) => (
				<BookCard key={book.id} book={book} />
			))}
		</div>
	)
}
