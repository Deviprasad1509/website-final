'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/lib/supabase/provider'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        // Get user's role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
        }

        // Get the redirect URL from query params or use default
        const redirectTo = searchParams.get('redirectTo') || (profile?.role === 'admin' ? '/admin' : '/library')
        
        await router.refresh() // Refresh to update auth state
        await router.replace(redirectTo)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">Get started today</h1>

        <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSignIn} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-card">
          <p className="text-center text-lg font-medium">Sign in to your account</p>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="sr-only">Email</label>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-border p-4 pe-12 text-sm shadow-sm bg-background text-foreground"
                placeholder="Enter email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-border p-4 pe-12 text-sm shadow-sm bg-background text-foreground"
                placeholder="Enter password"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            No account?
            <a className="underline" href="/signup"> Sign up</a>
          </p>
        </form>
      </div>
    </div>
  )
}
