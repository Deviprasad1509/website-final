"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/lib/auth-context"

export const dynamic = 'force-dynamic'

export default function AccountPage() {
  let state
  let router

  try {
    const auth = useAuth()
    state = auth.state
    router = useRouter()
  } catch (error) {
    // During prerendering, useAuth will throw
    return <div>Loading...</div>
  }

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      const redirect = `/login?next=${encodeURIComponent('/account')}`
      router.replace(redirect)
    }
  }, [state.isAuthenticated, state.isLoading, router])

  if (state.isLoading || !state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile />
      </div>
    </div>
  )
}

