"use client"

import { useEffect, useState } from "react"

// Mock current user for demo purposes
export async function getCurrentUser() {
  try {
    // For demo, return a mock admin user
    return {
      id: "demo-user-1",
      name: "Demo Admin",
      email: "admin@complexcare.dev",
      role: "admin",
      tenant_id: "demo-tenant-1",
      tenant_name: "ComplexCare Demo",
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}

