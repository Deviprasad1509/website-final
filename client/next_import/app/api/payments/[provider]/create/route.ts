import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '../../../../../server/payments/adapter'
import { requireAuth } from '../../../../../server/auth'
import { z } from 'zod'

const createPaymentSchema = z.object({
	orderId: z.string().uuid(),
	amount: z.number().positive(),
	currency: z.string().default('usd'),
	metadata: z.record(z.any()).optional()
})

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
	try {
		const user = await requireAuth()
		const body = await req.json()
		const { orderId, amount, currency, metadata } = createPaymentSchema.parse(body)
		
		const paymentIntent = await createPaymentIntent({
			orderId,
			amount,
			currency,
			provider: params.provider as 'stripe' | 'razorpay',
			metadata: { ...metadata, userId: user.id }
		})
		
		return NextResponse.json({ ok: true, paymentIntent })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
