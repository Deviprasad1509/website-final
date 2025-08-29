import { Mail } from 'lucide-react'

export default function Newsletter() {
	return (
		<section className="py-16 bg-blue-600 text-white">
			<div className="container mx-auto px-4 text-center">
				<div className="max-w-2xl mx-auto">
					<Mail className="h-12 w-12 mx-auto mb-6" />
					<h2 className="text-3xl font-bold mb-4">
						Stay Updated with New Releases
					</h2>
					<p className="text-blue-100 mb-8">
						Get notified about new books, exclusive offers, and reading recommendations.
					</p>
					
					<form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
						/>
						<button
							type="submit"
							className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							Subscribe
						</button>
					</form>
					
					<p className="text-sm text-blue-200 mt-4">
						We respect your privacy. Unsubscribe at any time.
					</p>
				</div>
			</div>
		</section>
	)
}
