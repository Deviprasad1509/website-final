"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react'
import { Book } from '../types/db'

interface CartItem {
	book: Book
	quantity: number
}

interface CartSidebarProps {
	isOpen: boolean
	onClose: () => void
	cartItems: CartItem[]
	onUpdateQuantity: (bookId: string, quantity: number) => void
	onRemoveItem: (bookId: string) => void
}

export default function CartSidebar({
	isOpen,
	onClose,
	cartItems,
	onUpdateQuantity,
	onRemoveItem
}: CartSidebarProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const total = cartItems.reduce((sum, item) => sum + (item.book.price || 0) * item.quantity, 0)
	const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

	const handleCheckout = async () => {
		if (cartItems.length === 0) return

		setLoading(true)
		setError('')

		try {
			// Create order
			const orderResponse = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: cartItems.map(item => ({
						book_id: item.book.id,
						qty: item.quantity
					}))
				})
			})

			const orderData = await orderResponse.json()

			if (orderData.ok) {
				// Redirect to checkout with order ID
				router.push(`/checkout?orderId=${orderData.order.id}`)
			} else {
				setError(orderData.error || 'Failed to create order')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleQuantityChange = (bookId: string, newQuantity: number) => {
		if (newQuantity < 1) return
		onUpdateQuantity(bookId, newQuantity)
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			<div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
			<div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center gap-2">
							<ShoppingCart className="h-5 w-5" />
							<h2 className="text-lg font-semibold">Shopping Cart</h2>
							<Badge variant="secondary">{itemCount}</Badge>
						</div>
						<Button variant="ghost" size="sm" onClick={onClose}>
							×
						</Button>
					</div>

					{/* Cart Items */}
					<div className="flex-1 overflow-y-auto p-4">
						{cartItems.length === 0 ? (
							<div className="text-center py-8">
								<ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
								<p className="text-gray-500">Your cart is empty</p>
								<Button onClick={onClose} className="mt-4">
									Start Shopping
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{cartItems.map((item) => (
									<Card key={item.book.id} className="p-3">
										<CardContent className="p-0">
											<div className="flex gap-3">
												<div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0">
													{item.book.cover_url && (
														<img
															src={item.book.cover_url}
															alt={item.book.title}
															className="w-full h-full object-cover rounded"
														/>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-medium text-sm truncate">
														{item.book.title}
													</h3>
													<p className="text-sm text-gray-500">
														${(item.book.price || 0).toFixed(2)}
													</p>
													<div className="flex items-center gap-2 mt-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleQuantityChange(item.book.id!, item.quantity - 1)}
															disabled={item.quantity <= 1}
														>
															-
														</Button>
														<span className="w-8 text-center text-sm">
															{item.quantity}
														</span>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleQuantityChange(item.book.id!, item.quantity + 1)}
														>
															+
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => onRemoveItem(item.book.id!)}
															className="ml-auto text-red-500 hover:text-red-700"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>

					{/* Footer */}
					{cartItems.length > 0 && (
						<div className="border-t p-4 space-y-4">
							{error && (
								<div className="text-red-500 text-sm text-center">{error}</div>
							)}
							
							<div className="flex justify-between text-lg font-semibold">
								<span>Total:</span>
								<span>${total.toFixed(2)}</span>
							</div>
							
							<Button
								onClick={handleCheckout}
								disabled={loading || cartItems.length === 0}
								className="w-full"
								size="lg"
							>
								{loading ? (
									<>
										<CreditCard className="mr-2 h-4 w-4 animate-pulse" />
										Processing...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Proceed to Checkout
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
