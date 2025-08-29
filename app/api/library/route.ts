import { NextRequest, NextResponse } from 'next/server'
import { listMyLibrary, hasAccess } from '../../../server/library'
import { requireAuth } from '../../../server/auth'

export async function GET(req: NextRequest) {
	try {
		const user = await requireAuth()
		const { searchParams } = new URL(req.url)
		const bookId = searchParams.get('bookId')
		
		if (bookId) {
			// Check access for specific book
			const hasBookAccess = await hasAccess(user.id, bookId)
			return NextResponse.json({ ok: true, hasAccess: hasBookAccess })
		} else {
			// List user's library
			const library = await listMyLibrary(user.id)
			return NextResponse.json({ ok: true, library })
		}
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 401 })
	}
}
