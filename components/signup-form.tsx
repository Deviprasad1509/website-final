'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabaseClient'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      return
    }

    // Redirect to a confirmation page
    router.push('/auth/confirm') 
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">Create an account</h1>

        <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          Join our community of book lovers.
        </p>

        <form onSubmit={handleSignUp} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-card">
          <p className="text-center text-lg font-medium">Sign up for a new account</p>

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
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Sign up
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?
            <a className="underline" href="/login"> Sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
