// lib/auth/require-permission.ts
import { hasPermission, getCurrentUserId } from "./auth-utils"
import type { Permission } from "./permissions"

/**
 * Checks if the current user has a specific permission.
 * If not, it throws an error.
 * This is a simplified version for demo mode.
 * In a real app, you might redirect or return a specific unauthorized response.
 * @param permission The permission to check.
 * @param tenantId The ID of the tenant context.
 * @throws Error if the user does not have the required permission.
 */
export async function requirePermission(permission: Permission, tenantId: string): Promise<void> {
  const userId = await getCurrentUserId()

  if (!userId) {
    throw new Error("Authentication required.")
  }

  const userHasPermission = await hasPermission(userId, tenantId, permission)

  if (!userHasPermission) {
    throw new Error(`Permission denied: ${permission}`)
  }
}
