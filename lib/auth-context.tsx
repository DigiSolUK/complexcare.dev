"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  tenantId: string | null
  isLoading: boolean
  error: string | null
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchSession = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/stack/session")
      const data = await response.json()

      if (data.isAuthenticated) {
        setIsAuthenticated(true)
        setUser(data.user)
        setTenantId(data.tenantId || null)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setTenantId(null)
        setError(data.error || "Authentication failed")
      }
    } catch (err) {
      console.error("Failed to fetch session:", err)
      setIsAuthenticated(false)
      setUser(null)
      setTenantId(null)
      setError("Failed to connect to authentication service.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const signIn = () => {
    // Redirect to login page or trigger Stack Auth login flow
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/stack/signout", { method: "POST" })
      setIsAuthenticated(false)
      setUser(null)
      setTenantId(null)
      router.push("/login") // Redirect to login after sign out
    } catch (err) {
      console.error("Failed to sign out:", err)
      setError("Failed to sign out.")
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, tenantId, isLoading, error, signIn, signOut }}>
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
