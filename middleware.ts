import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

// Define route protection rules
const ADMIN_ROUTES = ['/admin']
const PROTECTED_ROUTES = ['/account', '/library', '/orders', '/checkout']
const AUTH_ROUTES = ['/login', '/signup']
const PUBLIC_ROUTES = ['/', '/books', '/authors', '/categories', '/about', '/help']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { pathname } = request.nextUrl

  // Get session using getSession()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  // If user is not authenticated
  if (!session) {
    // Allow access to auth routes
    if (AUTH_ROUTES.includes(pathname)) {
      return response
    }

    // Redirect to login for protected routes
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) || 
        ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  }

  // User is authenticated
  try {
    // Get user's role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = profile?.role || 'user'

    // Create profile if it doesn't exist
    if (!profile) {
      await supabase
        .from('profiles')
        .insert([{ id: session.user.id, role: userRole }])
    }

    // Redirect from auth routes if already logged in
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(
        new URL(userRole === 'admin' ? '/admin' : '/library', request.url)
      )
    }

    // Block non-admin users from admin routes
    if (ADMIN_ROUTES.some(route => pathname.startsWith(route)) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/library', request.url))
    }

    // Allow access to all other routes
    return response
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

