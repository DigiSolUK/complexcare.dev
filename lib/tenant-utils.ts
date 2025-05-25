import type { NextRequest } from "next/server"
import { DEFAULT_TENANT_ID } from "./tenant"

// Get tenant from request (subdomain, header, or cookie)
export async function getTenantFromRequest(request: NextRequest) {
  try {
    // Emergency recovery mode - bypass tenant checks
    if (request.nextUrl.searchParams.has("safe_mode")) {
      return {
        id: DEFAULT_TENANT_ID,
        name: "Default Tenant (Safe Mode)",
        isActive: true,
      }
    }

    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID

    // In a real implementation, we would validate this tenant ID
    // For now, just return a basic tenant object
    return {
      id: tenantId,
      name: "Complex Care UK",
      isActive: true,
    }
  } catch (error) {
    console.error("Error getting tenant from request:", error)
    // In emergency mode, return the default tenant
    return {
      id: DEFAULT_TENANT_ID,
      name: "Default Tenant (Error Recovery)",
      isActive: true,
    }
  }
}
