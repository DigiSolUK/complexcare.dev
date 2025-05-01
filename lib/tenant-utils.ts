import type { NextRequest } from "next/server"
import { getTenantById } from "@/lib/services/user-service"

// Extract tenant ID from request headers or subdomain
export async function getTenantFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const hostname = request.headers.get("host")
  const subdomain = hostname ? hostname.split(".")[0] : null

  if (subdomain) {
    const tenant = await getTenantById(subdomain)
    return tenant
  }

  // Fallback to header or cookie if subdomain is not available
  const tenantId = request.headers.get("x-tenant-id") || request.cookies.get("tenantId")?.value

  if (tenantId) {
    const tenant = await getTenantById(tenantId)
    return tenant
  }

  return null
}

export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const tenant = await getTenantFromRequest(request)
  return tenant?.id || null
}
