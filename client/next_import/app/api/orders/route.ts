import { NextRequest, NextResponse } from 'next/server'
import { createOrder, listMyOrders, listAllOrders } from '../../../server/orders'
import { requireAuth, requireAdmin } from '../../../server/auth'
import { z } from 'zod'

const createOrderSchema = z.object({
	items: z.array(z.object({
		book_id: z.string().uuid(),
		qty: z.number().int().min(1)
	}))
})

export async function GET(req: NextRequest) {
	try {
		const user = await requireAuth()
		const { searchParams } = new URL(req.url)
		const isAdmin = searchParams.get('admin') === 'true'
		
		if (isAdmin) {
			await requireAdmin() // Double-check admin access
			const orders = await listAllOrders()
			return NextResponse.json({ ok: true, orders })
		} else {
			const orders = await listMyOrders(user.id)
			return NextResponse.json({ ok: true, orders })
		}
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 401 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireAuth()
		const body = await req.json()
		const { items } = createOrderSchema.parse(body)
		
		const order = await createOrder(user.id, items)
		return NextResponse.json({ ok: true, order }, { status: 201 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
