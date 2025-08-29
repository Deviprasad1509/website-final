"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { supabaseClient as supabase } from "./supabaseClient"
import { User } from "@supabase/supabase-js"

interface AuthUser {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: AuthUser | null }
  | { type: "SIGN_OUT" }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      }
    case "SIGN_OUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } catch (error) {
        console.error("Error checking session:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await loadUserProfile(session.user)
        } else if (event === "SIGNED_OUT") {
          dispatch({ type: "SIGN_OUT" })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: User) => {
    try {
      // Fetch user profile from our users table
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (error) {
        console.error("Error loading user profile:", error)
        // Create a basic profile if none exists
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.name || "User",
          role: "user",
          createdAt: new Date().toISOString()
        }
        dispatch({ type: "SET_USER", payload: authUser })
        return
      }

      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar,
        createdAt: profile.created_at
      }

      dispatch({ type: "SET_USER", payload: authUser })
    } catch (error) {
      console.error("Error in loadUserProfile:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      dispatch({ type: "SIGN_OUT" })
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!state.user) return

    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", state.user.id)

      if (error) {
        throw error
      }

      // Update local state
      dispatch({
        type: "SET_USER",
        payload: { ...state.user, ...updates }
      })
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  const value: AuthContextType = {
    state,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

