'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UserProfile {
  id: string
  email: string
  role: string
  created_at: string
}

export function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setProfile({
            ...profile,
            email: session.user.email || ''
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>No profile found</div>
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Profile</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="font-medium">Email</label>
          <p className="text-gray-600">{profile.email}</p>
        </div>
        <div className="space-y-2">
          <label className="font-medium">Role</label>
          <p className="text-gray-600 capitalize">{profile.role}</p>
        </div>
        <div className="space-y-2">
          <label className="font-medium">Member Since</label>
          <p className="text-gray-600">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="pt-4">
          <Button
            onClick={() => supabase.auth.signOut()}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

