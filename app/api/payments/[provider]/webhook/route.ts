import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook } from '../../../../../server/payments/adapter'
import { markOrderCompleted } from '../../../../../server/orders'

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
	try {
		const signature = req.headers.get('stripe-signature') || req.headers.get('razorpay-signature') || ''
		const body = await req.text()
		
		const webhook = await verifyWebhook(params.provider, body, signature)
		
		if (webhook.status === 'success') {
			// Extract order ID from webhook data and mark as completed
			// This will vary by provider - adjust based on your webhook payload structure
			const orderId = extractOrderIdFromWebhook(webhook.data, params.provider)
			if (orderId) {
				await markOrderCompleted(orderId)
			}
		}
		
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		console.error('Webhook error:', err)
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}

function extractOrderIdFromWebhook(data: any, provider: string): string | null {
	// Extract order ID based on provider webhook structure
	// Adjust these paths based on your actual webhook payloads
	if (provider === 'stripe') {
		return data.object?.metadata?.orderId || null
	} else if (provider === 'razorpay') {
		return data.payload?.payment?.entity?.notes?.orderId || null
	}
	return null
}
