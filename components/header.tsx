'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useAuth } from '@/lib/auth-context'

export default function Header() {
  const pathname = usePathname()
  let state

  try {
    const auth = useAuth()
    state = auth.state
  } catch (error) {
    // During static generation, useAuth might not be available
    state = { isAuthenticated: false, user: null, isLoading: true }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold hover:text-primary">
              BookStore
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/books" 
                className={`hover:text-primary transition-colors ${pathname === '/books' ? 'text-primary font-medium' : ''}`}
              >
                Books
              </Link>
              <Link 
                href="/categories" 
                className={`hover:text-primary transition-colors ${pathname === '/categories' ? 'text-primary font-medium' : ''}`}
              >
                Categories
              </Link>
              <Link 
                href="/authors" 
                className={`hover:text-primary transition-colors ${pathname === '/authors' ? 'text-primary font-medium' : ''}`}
              >
                Authors
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {state.isAuthenticated && state.user ? (
              <>
                <Link
                  href="/library"
                  className={`hover:text-primary transition-colors ${pathname === '/library' ? 'text-primary font-medium' : ''}`}
                >
                  My Library
                </Link>
                <Link
                  href="/orders"
                  className={`hover:text-primary transition-colors ${pathname === '/orders' ? 'text-primary font-medium' : ''}`}
                >
                  Orders
                </Link>
                <Link href="/account">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {state.user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

