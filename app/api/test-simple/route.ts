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

    // Test 1: Check if we can connect to Supabase at all
    try {
      const { data: connectionTest, error: connectionError } = await supabase.auth.getSession()
      if (connectionError) {
        return NextResponse.json({
          success: false,
          step: "connection",
          error: "Cannot connect to Supabase",
          details: connectionError.message
        }, { status: 500 })
      }
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        step: "connection",
        error: "Supabase connection failed",
        details: err.message
      }, { status: 500 })
    }

    // Test 2: Check if tables exist (using raw SQL)
    try {
      const { data: tableCheck, error: tableError } = await supabase.rpc('exec_sql', {
        sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'books', 'authors', 'categories')"
      })

      if (tableError) {
        // If RPC doesn't work, try a different approach
        return NextResponse.json({
          success: false,
          step: "tables",
          error: "Cannot check table existence",
          details: "RPC function not available, but connection works"
        })
      }

      return NextResponse.json({
        success: true,
        step: "tables",
        message: "Basic connection successful",
        tables: tableCheck
      })

    } catch (err: any) {
      return NextResponse.json({
        success: false,
        step: "tables",
        error: "Table check failed",
        details: err.message
      }, { status: 500 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      step: "unknown",
      error: "Unexpected error",
      details: error.message
    }, { status: 500 })
  }
}