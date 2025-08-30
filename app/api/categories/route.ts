export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { listCategories, createCategory, requireAdmin } from '@/lib/server-functions'
import { categorySchema } from '@/types/db'

export async function GET() {
	try {
		const categories = await listCategories()
		return NextResponse.json({ ok: true, categories })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const admin = await requireAdmin()
		const body = await req.json()
		const categoryData = categorySchema.omit({ id: true, created_at: true }).parse(body)
		
		const category = await createCategory(categoryData)
		return NextResponse.json({ ok: true, category }, { status: 201 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
