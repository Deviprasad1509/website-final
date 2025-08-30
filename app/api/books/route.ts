export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { listBooks, createBook, requireAuth } from '@/lib/server-functions'
import { bookSchema } from '@/types/db'

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const params = {
			q: searchParams.get('q') || undefined,
			category: searchParams.get('category') || undefined,
			sort: searchParams.get('sort') || undefined,
			limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
			cursor: searchParams.get('cursor') || undefined,
		}
		
		const books = await listBooks(params)
		return NextResponse.json({ ok: true, books })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const admin = await requireAuth()
		const body = await req.json()
		const bookData = bookSchema.omit({ id: true, created_at: true }).parse(body)
		
		const book = await createBook(bookData)
		return NextResponse.json({ ok: true, book }, { status: 201 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
