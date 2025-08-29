import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Hero() {
	return (
		<section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
			<div className="container mx-auto px-4 text-center">
				<div className="max-w-3xl mx-auto">
					<BookOpen className="h-16 w-16 mx-auto mb-6" />
					<h1 className="text-5xl font-bold mb-6">
						Discover Your Next Great Read
					</h1>
					<p className="text-xl mb-8 text-blue-100">
						Explore thousands of books across all genres. From bestsellers to hidden gems, 
						find your perfect story in our digital library.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/books"
							className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							Browse Books
						</Link>
						<Link
							href="/signup"
							className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
