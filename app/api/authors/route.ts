import { NextRequest, NextResponse } from 'next/server'
import { listAuthors, createAuthor, requireAdmin } from '@/lib/server-functions'
import { authorSchema } from '@/types/db'

export async function GET() {
	try {
		const authors = await listAuthors()
		return NextResponse.json({ ok: true, authors })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const admin = await requireAdmin()
		const body = await req.json()
		const authorData = authorSchema.omit({ id: true, created_at: true }).parse(body)
		
		const author = await createAuthor(authorData)
		return NextResponse.json({ ok: true, author }, { status: 201 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
