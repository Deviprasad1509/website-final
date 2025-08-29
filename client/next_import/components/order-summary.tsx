import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function OrderSummary() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Order Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex justify-between">
						<span>Subtotal:</span>
						<span>$0.00</span>
					</div>
					<div className="flex justify-between font-semibold text-lg">
						<span>Total:</span>
						<span>$0.00</span>
					</div>
				</div>
				<p className="text-sm text-gray-500 mt-4">
					Order summary will be populated when items are added to cart.
				</p>
			</CardContent>
		</Card>
	)
}
