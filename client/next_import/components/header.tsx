import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Header() {
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="flex items-center space-x-2">
						<BookOpen className="h-8 w-8 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">BookStore</span>
					</Link>
					
					<nav className="hidden md:flex space-x-8">
						<Link href="/books" className="text-gray-600 hover:text-gray-900">
							Books
						</Link>
						<Link href="/authors" className="text-gray-600 hover:text-gray-900">
							Authors
						</Link>
						<Link href="/categories" className="text-gray-600 hover:text-gray-900">
							Categories
						</Link>
					</nav>
					
					<div className="flex items-center space-x-4">
						<Link href="/login" className="text-gray-600 hover:text-gray-900">
							Sign In
						</Link>
						<Link 
							href="/signup" 
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
