import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

/**
 * Require admin role or redirect
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Check if user has admin role
  const userRoles = session.user.roles || []
  const isAdmin = userRoles.includes("admin") || userRoles.includes("superadmin")

  if (!isAdmin) {
    redirect("/unauthorized")
  }

  return session.user
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false

  // In a real app, check permissions from database
  // For now, just check if user is authenticated
  return true
}

/**
 * Get user's tenant IDs
 */
export async function getUserTenants() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  // In a real app, fetch from database
  // For now, return mock data
  return [
    { id: "tenant-1", name: "Main Hospital", role: "admin" },
    { id: "tenant-2", name: "North Clinic", role: "user" },
  ]
}
