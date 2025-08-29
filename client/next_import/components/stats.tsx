import { BookOpen, Users, Star, Download } from 'lucide-react'

export default function Stats() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<div>
						<BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
						<div className="text-3xl font-bold text-gray-900">10,000+</div>
						<div className="text-gray-600">Books Available</div>
					</div>
					
					<div>
						<Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
						<div className="text-3xl font-bold text-gray-900">50,000+</div>
						<div className="text-gray-600">Happy Readers</div>
					</div>
					
					<div>
						<Star className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
						<div className="text-3xl font-bold text-gray-900">4.8</div>
						<div className="text-gray-600">Average Rating</div>
					</div>
					
					<div>
						<Download className="h-12 w-12 mx-auto text-purple-600 mb-4" />
						<div className="text-3xl font-bold text-gray-900">1M+</div>
						<div className="text-gray-600">Downloads</div>
					</div>
				</div>
			</div>
		</section>
	)
}
