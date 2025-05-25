// lib/tenant-utils.ts

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

/**
 * Get tenant ID from request headers or default
 */
export function getTenantIdFromRequest(req: Request): string {
  try {
    // Try to get from headers first
    const tenantId = req.headers.get("x-tenant-id")
    if (tenantId) return tenantId

    // Default to a hard-coded tenant ID
    return DEFAULT_TENANT_ID
  } catch (error) {
    console.error("Error getting tenant ID from request:", error)
    return DEFAULT_TENANT_ID
  }
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
export function getCurrentTenant(): string {
  // In a real implementation, this would get the tenant from context or cookies
  // For now, return the default tenant ID
  return DEFAULT_TENANT_ID
}

/**
 * Safely extract tenant ID from tenant object or string
 */
export function extractTenantId(tenant: any): string {
  if (!tenant) return DEFAULT_TENANT_ID

  if (typeof tenant === "string") return tenant

  if (typeof tenant === "object" && tenant !== null && "id" in tenant) {
    return tenant.id
  }

  return DEFAULT_TENANT_ID
}

/**
 * Format tenant ID for display (short format)
 */
export function formatTenantId(id: string): string {
  return id.substring(0, 8)
}

/**
 * Check if a path is public (no tenant required)
 */
export function isPublicPath(path: string): boolean {
  const publicPaths = ["/login", "/register", "/forgot-password", "/api/auth", "/api/public"]
  return publicPaths.some((p) => path.startsWith(p))
}

/**
 * Get tenant ID from cookies or default (server-side)
 */
export function getTenantIdFromCookies(): string {
  try {
    // This would normally use cookies() from next/headers
    // For now, return the default tenant ID
    return DEFAULT_TENANT_ID
  } catch (error) {
    console.error("Error getting tenant ID from cookies:", error)
    return DEFAULT_TENANT_ID
  }
}

/**
 * Get current tenant ID (for server components)
 */
export function getCurrentTenantId(): string {
  return getTenantIdFromCookies()
}
