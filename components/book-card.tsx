import { Book } from '../types/db'
import Link from 'next/link'
import Image from 'next/image'

interface BookCardProps {
	book: Book
}

export default function BookCard({ book }: BookCardProps) {
	const coverUrl = book.cover_url || '/placeholder-cover.jpg'
	
	return (
		<Link href={`/book/${book.id}`} className="group">
			<div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-105">
				<div className="relative h-64">
					<Image
						src={coverUrl}
						alt={book.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
				<div className="p-4">
					<h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600">
						{book.title}
					</h3>
					<p className="text-gray-600 text-sm mb-2 line-clamp-2">
						{book.description || 'No description available'}
					</p>
					<div className="flex justify-between items-center">
						<span className="text-lg font-bold text-green-600">
							${book.price?.toFixed(2) || '0.00'}
						</span>
						<span className="text-sm text-gray-500">
							{book.stock || 0} in stock
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}
