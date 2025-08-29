import Link from 'next/link'

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">BookStore</h3>
						<p className="text-gray-400">
							Your digital bookstore for discovering amazing reads.
						</p>
					</div>
					
					<div>
						<h4 className="text-md font-semibold mb-4">Quick Links</h4>
						<ul className="space-y-2">
							<li><Link href="/books" className="text-gray-400 hover:text-white">Books</Link></li>
							<li><Link href="/authors" className="text-gray-400 hover:text-white">Authors</Link></li>
							<li><Link href="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
						</ul>
					</div>
					
					<div>
						<h4 className="text-md font-semibold mb-4">Support</h4>
						<ul className="space-y-2">
							<li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
							<li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
						</ul>
					</div>
					
					<div>
						<h4 className="text-md font-semibold mb-4">Legal</h4>
						<ul className="space-y-2">
							<li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
							<li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
						</ul>
					</div>
				</div>
				
				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
					<p>&copy; 2024 BookStore. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
