"use client"
import CheckoutForm from "../../components/checkout-form"
import { OrderSummary } from "../../components/order-summary"
import { Header } from "../../components/header"

export default function CheckoutPage() {
	// Mock data for now - this would come from cart context in a real app
	const mockOrder = {
		id: 'mock-order-123',
		total: 29.99,
		subtotal: 29.99,
		currency: 'usd',
		items: [
			{
				id: 'item-1',
				book_id: 'book-1',
				qty: 1,
				unit_price: 29.99,
				books: { title: 'Sample Book' }
			}
		]
	}

	const mockBooks = [
		{
			id: 'book-1',
			title: 'Sample Book',
			price: 29.99
		}
	]

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<div>
							<CheckoutForm order={mockOrder} books={mockBooks} />
						</div>
						<div>
							<OrderSummary />
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
