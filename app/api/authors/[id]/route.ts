import { NextRequest, NextResponse } from 'next/server'
import { getAuthor, updateAuthor, deleteAuthor } from '../../../../server/authors'
import { requireAdmin } from '../../../../server/auth'
import { authorSchema } from '../../../../types/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const author = await getAuthor(params.id)
		if (!author) {
			return NextResponse.json({ ok: false, error: 'Author not found' }, { status: 404 })
		}
		return NextResponse.json({ ok: true, author })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		const body = await req.json()
		const authorData = authorSchema.partial().omit({ id: true, created_at: true }).parse(body)
		
		const author = await updateAuthor(params.id, authorData)
		return NextResponse.json({ ok: true, author })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		await deleteAuthor(params.id)
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
