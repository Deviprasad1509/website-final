import { NextRequest, NextResponse } from 'next/server'
import { getBook, updateBook, deleteBook } from '../../../../server/books'
import { requireAdmin } from '../../../../server/auth'
import { bookSchema } from '../../../../types/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const book = await getBook(params.id)
		if (!book) {
			return NextResponse.json({ ok: false, error: 'Book not found' }, { status: 404 })
		}
		return NextResponse.json({ ok: true, book })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		const body = await req.json()
		const bookData = bookSchema.partial().omit({ id: true, created_at: true }).parse(body)
		
		const book = await updateBook(params.id, bookData)
		return NextResponse.json({ ok: true, book })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		await deleteBook(params.id)
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
