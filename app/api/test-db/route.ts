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

    // Test database connection by checking if users table exists
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Database schema not set up. Please run database/schema.sql in Supabase SQL Editor.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: data
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Database connection failed'
    }, { status: 500 })
  }
}