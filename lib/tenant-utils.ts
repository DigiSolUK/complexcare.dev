import type { NextRequest } from "next/server"
import { getTenantById } from "@/lib/services/user-service" // Assuming getTenantById is in user-service

export const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "demo-tenant-1"

// Extract tenant ID from request headers or subdomain
export async function getTenantFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const hostname = request.headers.get("host")
  // This logic assumes a structure like 'tenant-id.yourdomain.com'
  // For localhost or direct IP, it might not extract a subdomain.
  const subdomain = hostname ? hostname.split(".")[0] : null

  if (subdomain && subdomain !== "localhost" && subdomain !== "127") {
    // Avoid treating localhost/IP as tenant ID
    const tenant = await getTenantById(subdomain)
    if (tenant) return tenant
  }

  // Fallback to header or cookie if subdomain is not available or not a valid tenant
  const tenantId = request.headers.get("x-tenant-id") || request.cookies.get("tenantId")?.value

  if (tenantId) {
    const tenant = await getTenantById(tenantId)
    return tenant
  }

  // In demo mode, fallback to a default tenant if no specific tenant is identified
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NODE_ENV === "development") {
    const defaultTenantId = DEFAULT_TENANT_ID // Use a hardcoded default if env var is missing
    const tenant = await getTenantById(defaultTenantId)
    if (tenant) return tenant
  }

  return null
}

export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const tenant = await getTenantFromRequest(request)
  return tenant?.id || null
}

// Explicitly export getTenantId as requested by the error
export { getTenantIdFromRequest as getTenantId }
