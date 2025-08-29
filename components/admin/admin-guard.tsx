"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()

  useEffect(() => {
    // TODO: Replace with actual auth context when implemented
    // For now, this is a placeholder that will be updated
    // when we implement the auth context with Supabase
    
    console.log('🛡️ AdminGuard: Checking access...')
    
    // Mock check - replace with actual auth logic
    const isAuthenticated = false // TODO: Get from auth context
    const userRole = 'user' // TODO: Get from auth context
    
    if (!isAuthenticated) {
      console.log('❌ AdminGuard: User not authenticated, redirecting to login')
      router.push("/login")
      return
    }

    if (userRole !== "admin") {
      console.log('❌ AdminGuard: User is not admin (role:', userRole, '), redirecting to home')
      router.push("/")
      return
    }
    
    console.log('✅ AdminGuard: Access granted for admin user')
  }, [router])

  // TODO: Replace with actual auth check
  const isAuthenticated = false
  const userRole = 'user'

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
