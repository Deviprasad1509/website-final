'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/login')
          return
        }

        // Check if user has admin role in users table
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        // If user doesn't exist in users table, create them as admin (first user)
        if (!user) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || 'Admin User',
              role: 'admin'
            }])

          if (insertError) {
            console.error('Error creating admin user:', insertError)
            router.replace('/library')
            return
          }
        } else if (user.role !== 'admin') {
          router.replace('/library')
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Error in AdminGuard:', error)
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

