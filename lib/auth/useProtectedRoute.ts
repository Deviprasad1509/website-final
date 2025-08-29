'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'

const PROTECTED_ROUTES = {
  '/admin/dashboard': ['admin'],
  '/user/dashboard': ['user', 'admin'],
  '/account': ['user', 'admin'],
  '/orders': ['user', 'admin'],
  '/checkout': ['user', 'admin'],
  '/library': ['user', 'admin'],
}

export function useProtectedRoute() {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      if (Object.keys(PROTECTED_ROUTES).some(route => pathname?.startsWith(route))) {
        router.push('/login')
      }
      return
    }

    // Check if current route is protected
    const requiredRoles = Object.entries(PROTECTED_ROUTES)
      .find(([route]) => pathname?.startsWith(route))?.[1]

    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      router.push(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard')
    }
  }, [user, userRole, pathname, isLoading])

  return { isLoading, user, userRole }
}
