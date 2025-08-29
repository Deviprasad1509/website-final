"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Loader2, CreditCard, Shield } from 'lucide-react'
import { Order, Book } from '../types/db'

interface CheckoutFormProps {
	order: Order
	books: Book[]
}

export default function CheckoutForm({ order, books }: CheckoutFormProps) {
	const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		// Pre-select payment method from URL if available
		const method = searchParams.get('method') as 'stripe' | 'razorpay'
		if (method && ['stripe', 'razorpay'].includes(method)) {
			setPaymentMethod(method)
		}
	}, [searchParams])

	const handlePayment = async () => {
		setLoading(true)
		setError('')

		try {
			// Create payment intent
			const paymentResponse = await fetch(`/api/payments/${paymentMethod}/create`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orderId: order.id,
					amount: order.total,
					currency: order.currency || 'usd',
					metadata: {
						orderId: order.id,
						items: order.items?.map(item => ({
							bookId: item.book_id,
							quantity: item.qty
						}))
					}
				})
			})

			const paymentData = await paymentResponse.json()

			if (paymentData.ok) {
				// Handle payment based on provider
				if (paymentMethod === 'stripe') {
					// Redirect to Stripe Checkout or handle client-side
					handleStripePayment(paymentData.paymentIntent)
				} else if (paymentMethod === 'razorpay') {
					// Handle Razorpay payment
					handleRazorpayPayment(paymentData.paymentIntent)
				}
			} else {
				setError(paymentData.error || 'Payment failed')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleStripePayment = (paymentIntent: any) => {
		// TODO: Integrate with your existing Stripe implementation
		// This should call your existing Stripe checkout logic
		console.log('Stripe payment intent:', paymentIntent)
		setError('Stripe integration not yet implemented')
	}

	const handleRazorpayPayment = (paymentIntent: any) => {
		// TODO: Integrate with your existing Razorpay implementation
		// This should call your existing Razorpay payment logic
		console.log('Razorpay payment intent:', paymentIntent)
		setError('Razorpay integration not yet implemented')
	}

	const getBookDetails = (bookId: string) => {
		return books.find(book => book.id === bookId)
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Order Summary */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
							<CardDescription>Order #{order.id}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{order.items?.map((item) => {
								const book = getBookDetails(item.book_id)
								if (!book) return null
								
								return (
									<div key={item.id} className="flex justify-between items-center py-2 border-b">
										<div className="flex items-center gap-3">
											<div className="w-12 h-16 bg-gray-200 rounded">
												{book.cover_url && (
													<img
														src={book.cover_url}
														alt={book.title}
														className="w-full h-full object-cover rounded"
													/>
												)}
											</div>
											<div>
												<h4 className="font-medium">{book.title}</h4>
												<p className="text-sm text-gray-500">Qty: {item.qty}</p>
											</div>
										</div>
										<span className="font-medium">
											${((item.unit_price || 0) * item.qty).toFixed(2)}
										</span>
									</div>
								)
							})}
							
							<div className="pt-4 space-y-2">
								<div className="flex justify-between">
									<span>Subtotal:</span>
									<span>${order.subtotal?.toFixed(2)}</span>
								</div>
								<div className="flex justify-between font-semibold text-lg">
									<span>Total:</span>
									<span>${order.total?.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Payment Form */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Payment Method</CardTitle>
							<CardDescription>Choose your preferred payment method</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							
							{success && (
								<Alert>
									<AlertDescription>{success}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="payment-method">Payment Provider</Label>
								<Select value={paymentMethod} onValueChange={(value: 'stripe' | 'razorpay') => setPaymentMethod(value)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="stripe">
											<div className="flex items-center gap-2">
												<CreditCard className="h-4 w-4" />
												Stripe
											</div>
										</SelectItem>
										<SelectItem value="razorpay">
											<div className="flex items-center gap-2">
												<Shield className="h-4 w-4" />
												Razorpay
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="bg-blue-50 p-4 rounded-lg">
								<div className="flex items-start gap-3">
									<Shield className="h-5 w-5 text-blue-600 mt-0.5" />
									<div className="text-sm text-blue-800">
										<p className="font-medium">Secure Payment</p>
										<p>Your payment information is encrypted and secure.</p>
									</div>
								</div>
							</div>

							<Button
								onClick={handlePayment}
								disabled={loading}
								className="w-full"
								size="lg"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing Payment...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Pay ${order.total?.toFixed(2)}
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
