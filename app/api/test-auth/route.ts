import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Test 1: Check if we can connect to Supabase
    const { data: connectionTest, error: connectionError } = await supabase.auth.getSession()

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: connectionError.message
      }, { status: 500 })
    }

    // Test 2: Check if users table exists and is accessible
    const { data: usersTest, error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: 'Users table access failed',
        details: usersError.message,
        hint: 'Check RLS policies or table permissions'
      }, { status: 500 })
    }

    // Test 3: Check RLS policies by trying to read from users table
    const { data: rlsTest, error: rlsError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    // Test 4: Check if we can sign up a test user
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'testpassword123'

    const { data: signupTest, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Authentication system test completed',
      tests: {
        connection: {
          success: !connectionError,
          session: connectionTest?.session ? 'Session exists' : 'No active session'
        },
        usersTable: {
          success: !usersError,
          count: usersTest
        },
        rlsPolicies: {
          success: !rlsError,
          data: rlsTest,
          error: rlsError?.message
        },
        signup: {
          success: !signupError,
          user: signupTest?.user ? 'User created' : 'User creation failed',
          error: signupError?.message
        }
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during auth test',
      details: error.message
    }, { status: 500 })
  }
}