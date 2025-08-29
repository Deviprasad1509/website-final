import { Suspense } from 'react'
import Hero from '@/components/hero'
import FeaturedBooks from '@/components/featured-books'
import Stats from '@/components/stats'
import Newsletter from '@/components/newsletter'

export default function HomePage() {
	return (
		<main className="min-h-screen">
			<Hero />
			<Suspense fallback={<div className="text-center py-8">Loading featured books...</div>}>
				<FeaturedBooks />
			</Suspense>
			<Stats />
			<Newsletter />
		</main>
	)
}
