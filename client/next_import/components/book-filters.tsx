import Link from 'next/link'
import { Category } from '../types/db'

interface BookFiltersProps {
	categories: Category[]
}

export default function BookFilters({ categories }: BookFiltersProps) {
	return (
		<div className="space-y-6">
			{/* Categories */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4">Categories</h3>
				<div className="space-y-2">
					<Link
						href="/books"
						className="block px-3 py-2 rounded hover:bg-gray-100"
					>
						All Categories
					</Link>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/books?category=${category.id}`}
							className="block px-3 py-2 rounded hover:bg-gray-100"
						>
							{category.name}
						</Link>
					))}
				</div>
			</div>

			{/* Sort Options */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4">Sort By</h3>
				<div className="space-y-2">
					{[
						{ value: '-created_at', label: 'Newest First' },
						{ value: 'created_at', label: 'Oldest First' },
						{ value: 'title', label: 'Title A-Z' },
						{ value: '-title', label: 'Title Z-A' },
						{ value: 'price', label: 'Price Low-High' },
						{ value: '-price', label: 'Price High-Low' }
					].map((sort) => (
						<Link
							key={sort.value}
							href={`/books?sort=${sort.value}`}
							className="block px-3 py-2 rounded hover:bg-gray-100"
						>
							{sort.label}
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
