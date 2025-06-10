import { getServerSession } from "@/lib/auth/stack-auth-server"
import { neon } from "@neondatabase/serverless"
import type { Permission } from "./permissions"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set for auth-utils.")
}
const sql = neon(DATABASE_URL)

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.userId || null
}

export async function getCurrentTenantId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.tenantId || process.env.DEFAULT_TENANT_ID || null
}

export async function getCurrentUserRole(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.role || null
}

export async function hasPermission(
  permissionToCheck: Permission,
  userId?: string,
  tenantId?: string,
): Promise<boolean> {
  const currentUserId = userId || (await getCurrentUserId())
  const currentTenantId = tenantId || (await getCurrentTenantId())
  const currentUserRole = await getCurrentUserRole() // Get role from session

  if (!currentUserId || !currentTenantId || !currentUserRole) {
    console.warn("hasPermission check: User ID, Tenant ID, or Role is missing.")
    return false
  }

  // Direct role-based checks (simplified for common roles)
  if (currentUserRole === "superadmin") {
    return true // Superadmin has all permissions
  }

  // For other roles, you'd typically query a `role_permissions` table.
  // This is a placeholder for that logic.
  try {
    // Example: Fetch permissions associated with the user's current role
    // This assumes a `roles` table and a `role_permissions` table
    // roles (id UUID, name TEXT)
    // role_permissions (role_id UUID, permission_name TEXT)
    const permissionsResult = await sql`
      SELECT rp.permission_name
      FROM roles r
      JOIN role_permissions rp ON r.id = rp.role_id
      WHERE r.name = ${currentUserRole}
        AND rp.permission_name = ${permissionToCheck}
    `
    return permissionsResult.rows.length > 0
  } catch (dbError) {
    console.error("Database error during permission check:", dbError)
    return false
  }
}
