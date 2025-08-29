import { NextRequest, NextResponse } from 'next/server'
import { getCategory, updateCategory, deleteCategory } from '../../../../server/categories'
import { requireAdmin } from '../../../../server/auth'
import { categorySchema } from '../../../../types/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const category = await getCategory(params.id)
		if (!category) {
			return NextResponse.json({ ok: false, error: 'Category not found' }, { status: 404 })
		}
		return NextResponse.json({ ok: true, category })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		const body = await req.json()
		const categoryData = categorySchema.partial().omit({ id: true, created_at: true }).parse(body)
		
		const category = await updateCategory(params.id, categoryData)
		return NextResponse.json({ ok: true, category })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const admin = await requireAdmin()
		await deleteCategory(params.id)
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
	}
}
