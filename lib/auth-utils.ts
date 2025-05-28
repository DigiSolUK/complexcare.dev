/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  // In public mode, return a default user
  return {
    id: "default-user-id",
    name: "Public User",
    email: "public@example.com",
    roles: ["admin", "user"],
    image: "/abstract-geometric-shapes.png",
  }
}

/**
 * Require admin role or redirect
 */
export async function requireAdmin() {
  // In public mode, always grant admin access
  return {
    id: "default-admin-id",
    name: "Public Admin",
    email: "admin@example.com",
    roles: ["admin", "superadmin"],
    image: "/admin-interface.png",
  }
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  // In public mode, always return true
  return true
}

/**
 * Get user's tenant IDs
 */
export async function getUserTenants() {
  // In public mode, return default tenants
  return [
    { id: "tenant-1", name: "Main Hospital", role: "admin" },
    { id: "tenant-2", name: "North Clinic", role: "user" },
  ]
}
