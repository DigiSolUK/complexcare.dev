// lib/tenant-utils.ts

/**
 * Get tenant ID from request headers or default
 */
export function getTenantIdFromRequest(req: Request): string {
  // Try to get from headers first
  const tenantId = req.headers.get("x-tenant-id")
  if (tenantId) return tenantId

  // Default to a hard-coded tenant ID
  return "ba367cfe-6de0-4180-9566-1002b75cf82c" // DEFAULT_TENANT_ID
}

/**
 * Get tenant object from request
 */
export function getTenantFromRequest(req: Request): { id: string } {
  const tenantId = getTenantIdFromRequest(req)
  return { id: tenantId }
}

/**
 * Get current tenant object
 */
export function getCurrentTenant(): { id: string } {
  // In a real implementation, this would get the tenant from context or cookies
  // For now, return the default tenant ID
  return { id: "ba367cfe-6de0-4180-9566-1002b75cf82c" }
}

// Additional utility functions can be added here
export function formatTenantId(id: string): string {
  return id.substring(0, 8)
}

export function isPublicPath(path: string): boolean {
  const publicPaths = ["/login", "/register", "/forgot-password", "/api/auth", "/api/public"]
  return publicPaths.some((p) => path.startsWith(p))
}
