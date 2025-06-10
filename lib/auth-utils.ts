import { getServerSession } from "@/lib/auth/stack-auth-server"
import { UserRole, Permissions } from "./permissions"

interface UserSession {
  id: string
  email: string
  name?: string
  role: UserRole
  tenantId?: string
}

/**
 * Retrieves the current user session from the server.
 * This function should be called in Server Components or Route Handlers.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await getServerSession()
  if (session && session.user) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || UserRole.User, // Default to User role if not specified
      tenantId: session.tenantId,
    }
  }
  return null
}

/**
 * Checks if a user has a specific role.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Simple hierarchy: superadmin > tenant_admin > user
  const roleHierarchy = {
    [UserRole.User]: 0,
    [UserRole.TenantAdmin]: 1,
    [UserRole.SuperAdmin]: 2,
  }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const rolePermissions = Permissions[userRole] || []
  return rolePermissions.includes(permission)
}
