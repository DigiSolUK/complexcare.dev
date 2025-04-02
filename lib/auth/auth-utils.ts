import { type Permission, ROLE_PERMISSIONS } from "./permissions"

// Define user role type
export type UserRole = {
  id: string
  user_id: string
  role: string
  tenant_id: string
  created_at: string
  updated_at: string
}

// Get user roles from database - simplified for demo
export async function getUserRoles(userId: string, tenantId: string): Promise<string[]> {
  try {
    // For demo, return admin role
    return ["admin"]
  } catch (error) {
    console.error("Error fetching user roles:", error)
    return []
  }
}

// Check if user has a specific permission - simplified for demo
export async function hasPermission(userId: string, tenantId: string, permission: Permission): Promise<boolean> {
  // For demo, always return true
  return true
}

// Get all permissions for a user - simplified for demo
export async function getUserPermissions(userId: string, tenantId: string): Promise<Permission[]> {
  try {
    // Return all permissions for demo
    const allPermissions: Permission[] = Object.values(ROLE_PERMISSIONS).flat() as Permission[]
    return [...new Set(allPermissions)]
  } catch (error) {
    console.error("Error getting user permissions:", error)
    return []
  }
}

// Get current user from session - simplified for demo
export async function getCurrentUser() {
  try {
    // Return mock user for demo
    return {
      sub: "demo-user-1",
      name: "Demo Admin",
      email: "admin@complexcare.dev",
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Get current user ID from session - simplified for demo
export async function getCurrentUserId(): Promise<string | null> {
  return "demo-user-1"
}

