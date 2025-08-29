import { Book, Category } from '../../types/db'
import { Suspense } from 'react'
import BookGrid from '../../components/book-grid'
import BookFilters from '../../components/book-filters'
import { getBooks, getCategories } from '../../lib/books'

interface BooksPageProps {
	searchParams: {
		q?: string
		category?: string
		sort?: string
		page?: string
	}
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
	const [books, categories] = await Promise.all([
		getBooks(searchParams),
		getCategories()
	])

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-foreground mb-4">
							Discover Your Next Great Read
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Browse through our extensive collection of books across all genres and categories
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<aside className="lg:col-span-1">
							<Suspense fallback={<div>Loading filters...</div>}>
								<BookFilters categories={categories} />
							</Suspense>
						</aside>

						<main className="lg:col-span-3">
							<Suspense fallback={<div>Loading books...</div>}>
								<BookGrid books={books} />
							</Suspense>
						</main>
					</div>
				</div>
			</div>
		</div>
	)
}
