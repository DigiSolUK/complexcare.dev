"use client"

// lib/auth/stack-auth-client.ts (Client-side utilities)
// Placeholder for Stack Auth SDK initialization and client-side methods

// Presumed Stack Auth SDK import - replace with actual
// import { StackAuth } from 'stack-auth-sdk'; // Or whatever the SDK is called

let stackAuthClient: any // Replace 'any' with actual SDK client type

export function initStackAuthClient() {
  if (typeof window === "undefined") {
    // Don't run on server
    return
  }
  if (stackAuthClient) {
    return stackAuthClient
  }

  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
  const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

  if (!projectId || !publishableKey) {
    console.warn("Stack Auth client-side environment variables not set. Authentication will not work.")
    return null
  }

  try {
    // Placeholder: Initialize Stack Auth SDK
    // stackAuthClient = new StackAuth({ projectId, publishableKey });
    // console.log("Stack Auth client initialized.");

    // Mock implementation for now
    stackAuthClient = {
      signIn: async (credentials: { email: string; password?: string; provider?: string }) => {
        console.log("Mock StackAuth signIn:", credentials)
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          localStorage.setItem("stack_auth_token", "mock-jwt-token")
          localStorage.setItem(
            "stack_user",
            JSON.stringify({ id: "user-123", email: "test@example.com", name: "Test User" }),
          )
          window.dispatchEvent(new Event("storage")) // Notify listeners of storage change
          return { success: true, user: { id: "user-123", email: "test@example.com", name: "Test User" } }
        }
        return { success: false, error: "Invalid credentials" }
      },
      signOut: async () => {
        console.log("Mock StackAuth signOut")
        localStorage.removeItem("stack_auth_token")
        localStorage.removeItem("stack_user")
        window.dispatchEvent(new Event("storage"))
        return { success: true }
      },
      getSession: async () => {
        const token = localStorage.getItem("stack_auth_token")
        const userStr = localStorage.getItem("stack_user")
        if (token && userStr) {
          return { isAuthenticated: true, user: JSON.parse(userStr), token }
        }
        return { isAuthenticated: false, user: null, token: null }
      },
      // Add other methods like signUp, resetPassword, etc.
    }
    return stackAuthClient
  } catch (error) {
    console.error("Failed to initialize Stack Auth client:", error)
    return null
  }
}

export function getStackAuthClient() {
  if (!stackAuthClient) {
    return initStackAuthClient()
  }
  return stackAuthClient
}

// Example client-side hook
// import { useState, useEffect } from 'react';
// export function useStackAuth() {
//   const [session, setSession] = useState<{ isAuthenticated: boolean; user: any; token: string | null } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const client = getStackAuthClient();

//   useEffect(() => {
//     async function checkSession() {
//       if (client) {
//         const currentSession = await client.getSession();
//         setSession(currentSession);
//       }
//       setLoading(false);
//     }
//     checkSession();

//     // Listen to storage events to update session on signIn/signOut from other tabs
//     const handleStorageChange = () => checkSession();
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [client]);

//   return { session, loading, client };
// }
