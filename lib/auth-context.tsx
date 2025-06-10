"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { getStackAuthClient } from "./auth/stack-auth-client"

interface User {
  id: string // Changed from userId to id to match the user object returned by API
  email: string
  name?: string
  tenantId: string
  // Add other user properties from Stack Auth
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: { email: string; password?: string; provider?: string }) => Promise<{
    success: boolean
    error?: string
    user?: User
  }>
  signUp: (credentials: { email: string; password: string; name?: string }) => Promise<{
    success: boolean
    error?: string
    user?: User
  }>
  signOut: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const stackAuth = getStackAuthClient()

  const checkSession = useCallback(async () => {
    setIsLoading(true)
    try {
      const sessionData = await stackAuth.getSession()
      if (sessionData?.isAuthenticated && sessionData.user) {
        setUser(sessionData.user as User)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error checking session:", error)
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [stackAuth])

  useEffect(() => {
    checkSession()

    const handleAuthChange = () => checkSession()
    window.addEventListener("authChanged", handleAuthChange)
    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [checkSession])

  const signIn = async (credentials: { email: string; password?: string; provider?: string }) => {
    setIsLoading(true)
    const result = await stackAuth.signIn(credentials)
    if (result.success && result.user) {
      setUser(result.user as User)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    return result
  }

  const signUp = async (credentials: { email: string; password: string; name?: string }) => {
    setIsLoading(true)
    const result = await stackAuth.signUp(credentials)
    if (result.success && result.user) {
      setUser(result.user as User)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    return result
  }

  const signOut = async () => {
    setIsLoading(true)
    const result = await stackAuth.signOut()
    if (result.success) {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    return result
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signUp, signOut }}>
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
