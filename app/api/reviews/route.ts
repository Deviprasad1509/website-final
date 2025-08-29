import { NextRequest, NextResponse } from 'next/server'
import { listReviewsByBook, upsertReview } from '../../../server/reviews'
import { requireAuth } from '../../../server/auth'
import { z } from 'zod'

const createReviewSchema = z.object({
	bookId: z.string().uuid(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().default('')
})

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const bookId = searchParams.get('bookId')
		
		if (!bookId) {
			return NextResponse.json({ ok: false, error: 'bookId is required' }, { status: 400 })
		}
		
		const reviews = await listReviewsByBook(bookId)
		return NextResponse.json({ ok: true, reviews })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireAuth()
		const body = await req.json()
		const { bookId, rating, comment } = createReviewSchema.parse(body)
		
		const review = await upsertReview(user.id, bookId, rating, comment)
		return NextResponse.json({ ok: true, review }, { status: 201 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
