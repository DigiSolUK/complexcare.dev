"use client"

import { useEffect, useState } from "react"
import { getClientTenantId } from "./tenant"

// Client-side authentication utilities
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch user data from an API endpoint instead of using headers directly
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}

// Client-side tenant utilities
export function useTenant() {
  const [tenantId, setTenantId] = useState(() => getClientTenantId())

  useEffect(() => {
    // Sync with localStorage
    const storedTenantId = localStorage.getItem("tenantId")
    if (storedTenantId && storedTenantId !== tenantId) {
      setTenantId(storedTenantId)
    }

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tenantId" && e.newValue) {
        setTenantId(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [tenantId])

  return { tenantId }
}
