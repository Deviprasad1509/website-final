'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UserMenuPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (user) {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser({ ...user, ...profile })
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Welcome to Your Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Role:</span> {user?.role}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a href="/books" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Browse Books
            </a>
            <a href="/library" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Your Library
            </a>
            <a href="/orders" className="block p-3 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90">
              Order History
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

