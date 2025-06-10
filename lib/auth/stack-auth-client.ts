// lib/auth/stack-auth-client.ts (Client-side utilities for Neon Auth)
// This file will primarily interact with your API endpoints.

interface User {
  id: string
  email: string
  name?: string
  tenantId: string
  // Add other user properties
}

interface SessionData {
  isAuthenticated: boolean
  user: User | null
  tenantId?: string
  token?: string // Token might not be exposed directly to client from getSession
  error?: string
}

// This client doesn't need direct SDK initialization like a third-party service.
// It's a wrapper around fetch calls to your backend.

export const stackAuthClient = {
  signIn: async (credentials: { email: string; password?: string; provider?: string }) => {
    // Provider-based sign-in is not implemented here, focus on email/password
    if (!credentials.email || !credentials.password) {
      return { success: false, error: "Email and password are required." }
    }
    try {
      const response = await fetch("/api/auth/stack/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        // Trigger a session refresh or notify listeners if needed
        window.dispatchEvent(new CustomEvent("authChanged"))
        return { success: true, user: data.user as User }
      }
      return { success: false, error: data.error || "Sign-in failed" }
    } catch (error: any) {
      console.error("Client signIn error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  },

  signOut: async () => {
    try {
      const response = await fetch("/api/auth/stack/signout", { method: "POST" })
      const data = await response.json()
      if (response.ok && data.success) {
        window.dispatchEvent(new CustomEvent("authChanged"))
        return { success: true }
      }
      return { success: false, error: data.error || "Sign-out failed" }
    } catch (error: any) {
      console.error("Client signOut error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  },

  signUp: async (credentials: { email: string; password: string; name?: string }) => {
    if (!credentials.email || !credentials.password) {
      return { success: false, error: "Email and password are required." }
    }
    try {
      const response = await fetch("/api/auth/stack/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        window.dispatchEvent(new CustomEvent("authChanged"))
        return { success: true, user: data.user as User }
      }
      return { success: false, error: data.error || "Signup failed" }
    } catch (error: any) {
      console.error("Client signUp error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  },

  getSession: async (): Promise<SessionData> => {
    try {
      const response = await fetch("/api/auth/stack/session")
      const data = await response.json()
      if (response.ok) {
        return data as SessionData
      }
      return { isAuthenticated: false, user: null, error: data.error || "Failed to fetch session" }
    } catch (error: any) {
      console.error("Client getSession error:", error)
      return { isAuthenticated: false, user: null, error: error.message || "An unexpected error occurred" }
    }
  },
}

export function getStackAuthClient() {
  return stackAuthClient
}
