export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { signIn, signOut, signUp } from '@/lib/server-functions'

const signupSchema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1) })
const signinSchema = z.object({ email: z.string().email(), password: z.string().min(8) })

export async function POST(req: Request, { params }: { params: { action: string } }) {
	try {
		const body = await req.json().catch(() => ({}))
		if (params.action === 'signup') {
			const { email, password, name } = signupSchema.parse(body)
			const result = await signUp(email, password, name)
			return NextResponse.json({ ok: true, userId: result.userId })
		}
		if (params.action === 'signin') {
			const { email, password } = signinSchema.parse(body)
			const result = await signIn(email, password)
			return NextResponse.json({ ok: true, session: { expires_at: result.session?.expires_at } })
		}
		if (params.action === 'signout') {
			await signOut()
			return NextResponse.json({ ok: true })
		}
		return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message || 'Bad Request' }, { status: 400 })
	}
}


