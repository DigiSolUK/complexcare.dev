// lib/auth/auth-utils.ts

import { getSession } from "@/lib/auth" // Import getSession and the demo 'auth' object
import { ROLE_PERMISSIONS, ROLES, type Role, type Permission } from "./permissions"

// Get the current user ID from the session
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.user?.id || null
}

// Check if the user has the specified permission
export async function hasPermission(userId: string, tenantId: string, permission: Permission): Promise<boolean> {
  const session = await getSession()
  const userRoles = session?.user?.roles || []

  // Check if the user is a super admin
  if (userRoles.includes(ROLES.SUPER_ADMIN)) {
    return true
  }

  // Check if the user has the permission in their roles
  for (const role of userRoles) {
    if (ROLE_PERMISSIONS[role as Role]?.includes(permission)) {
      return true
    }
  }

  return false
}

/**
 * In demo mode, this function returns the mock session.
 * In a real application, this would be NextAuth.js's `auth()` function.
 */
export async function getAuth() {
  return await getSession()
}
