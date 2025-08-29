import { NextResponse } from 'next/server'

export function middleware(req: Request) {
	// Placeholder: real auth gate can be added using supabase auth helpers
	return NextResponse.next()
}

export const config = {
	matcher: [
		'/account/:path*',
		'/orders/:path*',
		'/checkout/:path*',
		'/library/:path*',
		'/admin/:path*',
	],
}
