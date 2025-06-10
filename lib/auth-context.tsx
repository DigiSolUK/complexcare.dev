"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { getStackAuthClient } from "./auth/stack-auth-client" // Using the client-side SDK

interface User {
  id: string
  email: string
  name?: string
  // Add other user properties from Stack Auth
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: { email: string; password?: string; provider?: string }) => Promise<{
    success: boolean
    error?: string
  }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  // Add other methods like signUp, etc.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const stackAuth = getStackAuthClient()

  const checkSession = useCallback(async () => {
    setIsLoading(true)
    if (stackAuth) {
      try {
        // Attempt to get session from client SDK (e.g., from localStorage or by pinging an endpoint)
        const sessionData = await stackAuth.getSession() // Assumes SDK has getSession()
        if (sessionData?.isAuthenticated && sessionData.user) {
          setUser(sessionData.user)
          setIsAuthenticated(true)
        } else {
          // Optionally, verify with a backend endpoint if client SDK doesn't provide robust session check
          const res = await fetch("/api/auth/stack/session")
          if (res.ok) {
            const serverSession = await res.json()
            if (serverSession.isAuthenticated && serverSession.user) {
              setUser(serverSession.user)
              setIsAuthenticated(true)
            } else {
              setUser(null)
              setIsAuthenticated(false)
            }
          } else {
            setUser(null)
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setUser(null)
        setIsAuthenticated(false)
      }
    } else {
      // If stackAuth client isn't available (e.g. env vars missing)
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [stackAuth])

  useEffect(() => {
    checkSession()
    // Listen to storage events to update session on signIn/signOut from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "stack_auth_token" || event.key === "stack_user") {
        checkSession()
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [checkSession])

  const signIn = async (credentials: { email: string; password?: string; provider?: string }) => {
    if (!stackAuth) return { success: false, error: "Auth client not initialized" }
    setIsLoading(true)
    try {
      // Use client-side API route for sign-in which then calls server-side Stack Auth
      const response = await fetch("/api/auth/stack/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        // The API route should set the cookie, client SDK might update localStorage
        await stackAuth.getSession() // Refresh client SDK state if needed
        return { success: true }
      } else {
        return { success: false, error: data.error || "Sign-in failed" }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    if (!stackAuth) return { success: false, error: "Auth client not initialized" }
    setIsLoading(true)
    try {
      // Use client-side API route for sign-out
      const response = await fetch("/api/auth/stack/signout", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setUser(null)
        setIsAuthenticated(false)
        await stackAuth.signOut() // Clear client SDK state
        return { success: true }
      } else {
        return { success: false, error: data.error || "Sign-out failed" }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
