"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/lib/auth"
import { getUserById } from "@/lib/services/user-service"

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.id) {
    return null
  }

  const user = await getUserById(session.user.id)
  return user
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
